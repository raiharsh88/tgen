# Argument Parser Script

## Usage

Use the following command to run the splitter

```bash
--entryFile <path_to_entry_file>: Path to the entry file.
--projectDir <path_to_project_directory>: Path to the project directory.
--aliasMap <map>: Alias map as a string representing a dictionary.
--testDir <path_to_test_directory>: Path to the test directory.
--fileExtension <File extension (ts)>
```

```bash
cd backend
ts-node argument_parser.js --entryFile "<path_to_entry_file>" --projectDir "<path_to_project_directory>" --aliasMap "{ '@src': '/home/harsh/chat-stocks/test_app/' }" --testDir "<path_to_test_directory>" --fileExtension 'ts'
```

