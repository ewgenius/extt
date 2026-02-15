# Implementation Plan: Complete Core CLI Functionality for the MVP

## Phase 1: Core Note Management - Creation and Reading

- [ ] Task: Review and document existing implementation for `extt new` and `extt read`.
    - [ ] Analyze the current implementation in `extt-cli` and `extt-core`.
    - [ ] Document any gaps or areas for improvement.
- [ ] Task: Implement comprehensive tests for `extt new`.
    - [ ] Write tests for creating a note with and without a body.
    - [ ] Write tests for handling invalid input.
- [ ] Task: Implement comprehensive tests for `extt read`.
    - [ ] Write tests for reading a full note.
    - [ ] Write tests for the `--head`, `--from`, and `--to` flags.
    - [ ] Write tests for reading a non-existent note.
- [ ] Task: Refactor and enhance `extt new` and `extt read` based on test findings.
    - [ ] Implement any missing logic to make all tests pass.
    - [ ] Refactor the code for clarity and efficiency.
- [ ] Task: Conductor - User Manual Verification 'Core Note Management - Creation and Reading' (Protocol in workflow.md)

## Phase 2: Core Note Management - Listing and Searching

- [ ] Task: Review and document existing implementation for `extt list` and `extt search`.
    - [ ] Analyze the current implementation in `extt-cli` and `extt-core`.
    - [ ] Document any gaps or areas for improvement.
- [ ] Task: Implement comprehensive tests for `extt list`.
    - [ ] Write tests for listing notes in an empty directory.
    - [ ] Write tests for listing multiple notes.
- [ ] Task: Implement comprehensive tests for `extt search`.
    - [ ] Write tests for searching with no results.
    - [ ] Write tests for searching with one or more results.
    - [ ] Write tests for case-insensitive search.
- [ ] Task: Refactor and enhance `extt list` and `extt search` based on test findings.
    - [ ] Implement any missing logic to make all tests pass.
    - [ ] Refactor the code for clarity and efficiency.
- [ ] Task: Conductor - User Manual Verification 'Core Note Management - Listing and Searching' (Protocol in workflow.md)

## Phase 3: Core Note Management - Modification and Deletion

- [ ] Task: Review and document existing implementation for `extt update`, `extt move`, and `extt delete`.
    - [ ] Analyze the current implementation in `extt-cli` and `extt-core`.
    - [ ] Document any gaps or areas for improvement.
- [ ] Task: Implement comprehensive tests for `extt update`.
    - [ ] Write tests for updating the body of a note.
    - [ ] Write tests for updating a non-existent note.
- [ ] Task: Implement comprehensive tests for `extt move`.
    - [ ] Write tests for renaming a note.
    - [ ] Write tests for moving a note to a name that already exists.
- [ ] Task: Implement comprehensive tests for `extt delete`.
    - [ ] Write tests for deleting a note.
    - [ ] Write tests for deleting a non-existent note.
- [ ] Task: Refactor and enhance `extt update`, `extt move`, and `extt delete` based on test findings.
    - [ ] Implement any missing logic to make all tests pass.
    - [ ] Refactor the code for clarity and efficiency.
- [ ] Task: Conductor - User Manual Verification 'Core Note Management - Modification and Deletion' (Protocol in workflow.md)

## Phase 4: Maintenance Commands

- [ ] Task: Review and document existing implementation for `extt sync`, `extt version`, and `extt upgrade`.
    - [ ] Analyze the current implementation in `extt-cli` and `extt-core`.
    - [ ] Document any gaps or areas for improvement.
- [ ] Task: Implement comprehensive tests for `extt sync`.
    - [ ] Write tests to verify the index is correctly updated.
- [ ] Task: Implement tests for `extt version`.
    - [ ] Write tests to ensure the version command returns the correct version string.
- [ ] Task: Implement tests for `extt upgrade`.
    - [ ] Write tests to simulate the upgrade process (if possible in a test environment).
- [ ] Task: Refactor and enhance `extt sync`, `extt version`, and `extt upgrade` based on test findings.
    - [ ] Implement any missing logic to make all tests pass.
    - [ ] Refactor the code for clarity and efficiency.
- [ ] Task: Conductor - User Manual Verification 'Maintenance Commands' (Protocol in workflow.md)
