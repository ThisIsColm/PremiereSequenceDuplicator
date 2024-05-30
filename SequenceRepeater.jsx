// Number of sequences you want to create
var numSequences = 10;
var baseSequenceName = "Sequence_1"; // The name of the sequence you want to duplicate
var csvFilePath = "C:/Users/Colm/Desktop/sequence_names.csv"; // Path to your CSV file

// Get the project
var project = app.project;

// Function to read names from CSV file
function readNamesFromCSV(filePath) {
    var file = new File(filePath);
    file.open("r");

    var names = [];
    while (!file.eof) {
        var line = file.readln();
        if (line.length > 0) { // Check to avoid any extraneous whitespace issues
            names.push(line);
        }
    }

    file.close();
    return names;
}

// Function to delay for a given number of milliseconds


// Function to log messages to the ExtendScript Toolkit Console
function log(message) {
    $.writeln(message);
}

// Function to pad numbers with leading zeros
function padNumber(number, width) {
    var numberString = number.toString();
    while (numberString.length < width) {
        numberString = '0' + numberString;
    }
    return numberString;
}

// Read names from CSV
var sequenceNames = readNamesFromCSV(csvFilePath);
log("Read sequence names from CSV: " + sequenceNames.join(", "));

// Check if the number of names matches the number of sequences to create
if (sequenceNames.length < numSequences) {
    alert("Not enough names in the CSV file. Found " + sequenceNames.length + " names, but need " + numSequences + ".");
} else {
    // Find the sequence to duplicate
    var originalSequence = null;
    for (var j = 0; j < project.sequences.length; j++) {
        if (project.sequences[j].name == baseSequenceName) {
            originalSequence = project.sequences[j];
            break;
        }
    }

    if (originalSequence == null) {
        alert("Sequence not found: " + baseSequenceName);
    } else {
        log("Found original sequence: " + originalSequence.name);

        // Create the duplicated sequences
        for (var i = 0; i < numSequences; i++) {
            var newSeqName = padNumber(i + 1, 3) + "_" + sequenceNames[i];
            log("Duplicating sequence for new name: " + newSeqName);

            // Set the sequence as active and duplicate it
            app.project.activeSequence = originalSequence;
            var newSequence = originalSequence.clone();

            // Delay to ensure the sequence is duplicated
            delay(100);

            // Explicitly access the newly duplicated sequence by comparing names
            var newSequenceIndex = -1;
            for (var k = 0; k < project.sequences.length; k++) {
                if (project.sequences[k].name === originalSequence.name + " Copy") {
                    newSequenceIndex = k;
                    break;
                }
            }

            if (newSequenceIndex === -1) {
                log("Failed to find the new sequence copy");
                alert("Failed to find the new sequence copy");
                break;
            }

            newSequence = project.sequences[newSequenceIndex];

            // Log all sequences before renaming
            log("Sequences before renaming:");
            for (var k = 0; k < project.sequences.length; k++) {
                log("Sequence " + k + ": " + project.sequences[k].name);
            }

            // Rename the new sequence
            newSequence.name = newSeqName;

            // Delay to ensure the renaming is registered
            delay(10);

            // Log all sequences after renaming
            log("Sequences after renaming:");
            for (var k = 0; k < project.sequences.length; k++) {
                log("Sequence " + k + ": " + project.sequences[k].name);
            }

            log("Renamed sequence to: " + newSequence.name);

            // Verify the new sequence has been renamed
            if (newSequence.name !== newSeqName) {
                log("Failed to rename the sequence to: " + newSeqName);
                alert("Failed to rename the sequence to: " + newSeqName);
                break;
            }
        }

        alert("Sequences duplicated and renamed successfully!");
    }
}
