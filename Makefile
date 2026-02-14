.PHONY: install

install:
	cargo build --release --bin extt
	mkdir -p $(HOME)/.extt/bin
	cp target/release/extt $(HOME)/.extt/bin/extt
