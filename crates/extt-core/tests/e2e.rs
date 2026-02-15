use extt_core::{Store, Metadata};
use std::fs;
use std::path::Path;
use tempfile::tempdir;

#[test]
fn e2e_full_workflow() -> anyhow::Result<()> {
    // 1. Setup Environment
    let dir = tempdir()?;
    let root = dir.path().join("vault");
    let db_path = dir.path().join("extt.db");

    fs::create_dir(&root)?;

    // Initialize Store
    let mut store = Store::new(root.clone(), db_path.clone())?;

    // 2. Create a Note via Store
    let note1_path = Path::new("journal/2023-10-27.md");
    store.create(
        note1_path,
        "# Today's Entry\nStarted working on extt.",
        Some(Metadata {
            title: Some("Journal Entry".into()),
            tags: Some(vec!["journal".into(), "rust".into()]),
            created_at: Some("2023-10-27".into()),
            updated_at: None,
            extra: Default::default(),
        })
    )?;

    // Verify file existence
    assert!(root.join("journal/2023-10-27.md").exists());
    let content = fs::read_to_string(root.join("journal/2023-10-27.md"))?;
    assert!(content.contains("title: Journal Entry"));
    assert!(content.contains("tags:"));
    assert!(content.contains("- journal"));

    // Verify DB
    let notes = store.list()?;
    assert_eq!(notes.len(), 1);
    assert_eq!(notes[0].path, note1_path);
    assert_eq!(notes[0].title.as_deref(), Some("Journal Entry"));

    // 3. Create a Note Manually (Simulate external edit)
    let note2_path = Path::new("ideas.md");
    fs::write(
        root.join(note2_path),
        "---\ntitle: My Ideas\n---\n* Idea 1\n* Idea 2"
    )?;

    // Verify it's not in DB yet
    let notes = store.list()?;
    assert_eq!(notes.len(), 1);

    // 4. Sync
    store.sync()?;

    // Verify DB updated
    let notes = store.list()?;
    assert_eq!(notes.len(), 2);

    // Search
    let results = store.search("Ideas")?;
    assert_eq!(results.len(), 1);
    assert_eq!(results[0].title.as_deref(), Some("My Ideas"));

    // 5. Update Note
    store.update(
        note1_path,
        Some("# Today's Entry\nUpdated content."),
        Some("Updated Journal")
    )?;

    let note = store.get(note1_path)?;
    assert_eq!(note.metadata.title.as_deref(), Some("Updated Journal"));
    assert!(note.content.contains("Updated content"));

    // Verify file updated
    let content = fs::read_to_string(root.join(note1_path))?;
    assert!(content.contains("title: Updated Journal"));

    // 6. Move Note
    let new_path = Path::new("archive/journal_old.md");
    store.move_note(note1_path, new_path)?;

    assert!(!root.join(note1_path).exists());
    assert!(root.join(new_path).exists());

    let notes = store.list()?;
    assert!(notes.iter().any(|n| n.path == new_path));
    assert!(!notes.iter().any(|n| n.path == note1_path));

    // 7. Delete Note
    store.delete(note2_path)?;
    assert!(!root.join(note2_path).exists());

    let notes = store.list()?;
    assert_eq!(notes.len(), 1);
    assert_eq!(notes[0].path, new_path);

    Ok(())
}
