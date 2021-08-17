// Handler for SearchFxCmd
const handleSearchFxCmd = () => {
  // ---------- Global ----------
  const constants = {
    songLengthOffset: 950,
    songPositionOffset: 952,
    patternStartOffset: 1084,
    commandOffset: 2,
    commandLowbyteOffset: 3,
    positionTableLength: 128,
    maxPatternPosition: 64,
    maxChannels: 4,
    patternLength: null,
    noteDataLength: 4,
    patternRowLength: null,
    commandNumberMask: 0xF,
    // HTML elements
    elements: {
      inputGroupFile01: document.querySelector("#inputGroupFile01"),
      commandSelect: document.querySelector("#commandSelect"),
      extendedCommandSelect: document.querySelector("#extendedCommandSelect"),
      commandSearchContainer: document.querySelector("#commandSearchContainer"),
      extendedCommandSearchContainer: document.querySelector("#extendedCommandSearchContainer"),
      tableBody: document.querySelector("#tableBody"),
      groupChange: document.querySelectorAll(".groupChange")
    },
    shortkeyTable: [
      /* Character codes for command numbers
      0   1   2   3   4   5   6   7   8   9   A   B   C   D    E    F */
      48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 97, 98, 99, 100, 101, 102
    ],
    shortkeyIndexTable: [
      /* Index for command and extended command numbers
      0  1  2  3  4  5  6  7  8  9  A   B   C   D   E   F */
      0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15
    ]
  };

  constants.patternLength = constants.maxPatternPosition * constants.maxChannels;
  constants.patternRowLength = constants.noteDataLength * constants.maxChannels;

  const variables = {
    isFileLoaded: false,
    fileContent: "",
    patternNumber: 0,
    highestPatternNumber: 0,
    commandNumber: 0,
    extendedCommandNumber: 0,
    commandLowbyte: 0,
    searchCommandNumber: 0,
    searchExtendedCommandNumber: 0
  };

  // Handler for search command in patterns if module was a loaded
  const handleSearchCommand = (constants, variables) => {
    if (variables.isFileLoaded) {

      // Get highest pattern number in pattern position table
      const getHighestPattern = ({ songPositionOffset, positionTableLength }, variables) => {
        for (let i = 0; i < positionTableLength; i++) {
          ((variables.patternNumber = variables.fileContent[songPositionOffset + i].charCodeAt(0)) > variables.highestPatternNumber) && (variables.highestPatternNumber = variables.patternNumber);
        }
        variables.highestPatternNumber++; // Count starts at 0
      }

      // Get button values and convert them to integers
      const getInputElementValues = ({ elements }, variables) => {
        const { commandSelect, extendedCommandSelect } = elements;
        variables.searchCommandNumber = parseInt(commandSelect.value);
        variables.searchExtendedCommandNumber = parseInt(extendedCommandSelect.value);
      }

      // Scan for commands in Mod file
      const scanModFile = (constants, variables) => {

        // Search command or extended command by number
        const searchForCommand = (constants, variables) => {

          // Fill the table with the values: Position, Pattern, Patternrow and Channel number
          const outputDataToTable = ({ noteDataLength, patternRowLength, elements }, variables, i, j, k) => {

            // Create list entry
            const createListEntry = (tr, entryText) => {
              const td = document.createElement("td");
              td.innerHTML = entryText.toString();
              tr.append(td);
            }

            const tr = document.createElement("tr");
            elements.tableBody.append(tr);
            createListEntry(tr, i);
            createListEntry(tr, variables.patternNumber);
            createListEntry(tr, j / patternRowLength);
            createListEntry(tr, k / noteDataLength);
          };

          const { songLengthOffset, songPositionOffset, patternStartOffset, commandOffset, commandLowbyteOffset, maxPatternPosition, maxChannels, patternLength, noteDataLength, patternRowLength, commandNumberMask } = constants;
          const songLength = variables.fileContent[songLengthOffset].charCodeAt(0);
          for (let i = 0; i < songLength; i++) {
            variables.patternNumber = variables.fileContent[(songPositionOffset + i)].charCodeAt(0);
            const patternOffset = (variables.patternNumber * patternLength * noteDataLength); // Pattern offset in song structure
            for (let j = 0; j < (maxPatternPosition * patternRowLength); j += patternRowLength) { // 16th steps per row
              for (let k = 0; k < (maxChannels * noteDataLength); k += noteDataLength) { // 4th steps per channel
                const commandNumberIndex = (patternStartOffset + patternOffset + j + k + commandOffset);
                variables.commandNumber = variables.fileContent[commandNumberIndex].charCodeAt(0) & commandNumberMask; // Mask out upper nibble
                if (variables.commandNumber === variables.searchCommandNumber && variables.commandNumber !== 14) {
                  if (variables.commandNumber === 0 && variables.searchCommandNumber === 0) {
                    const commandNumberIndex = (patternStartOffset + patternOffset + j + k + commandLowbyteOffset);
                    ((variables.commandLowbyte = variables.fileContent[commandNumberIndex].charCodeAt(0)) > 0) && (outputDataToTable(constants, variables, i, j, k, variables.patternNumber));
                  }
                  else {
                    outputDataToTable(constants, variables, i, j, k, variables.patternNumber);
                  }
                }
                if (variables.commandNumber === 14) {
                  const extendedCommandNumberIndex = (patternStartOffset + patternOffset + j + k + commandLowbyteOffset);
                  ((variables.extendedCommandNumber = variables.fileContent[extendedCommandNumberIndex].charCodeAt(0) >> 4) === variables.searchExtendedCommandNumber) && (outputDataToTable(constants, variables, i, j, k, variables.patternNumber));
                }
              }
            }
          }
        };

        const { elements } = constants;
        const { commandSelect, extendedCommandSelect, tableBody } = elements;
        if (variables.searchCommandNumber === -1) {
          if (!commandSelect.classList.contains("text-danger") || extendedCommandSelect.classList.contains("text-danger")) {
            commandSelect.classList.add("text-danger");
            extendedCommandSelect.classList.add("text-danger");
          }
        }
        else {
          tableBody.innerHTML = ""; // Remove <tr>/<td> tags from table
          searchForCommand(constants, variables);
        }
      };

      getHighestPattern(constants, variables);
      getInputElementValues(constants, variables);
      scanModFile(constants, variables);
    }
  }
  // Add handler for search command in patterns if module was a loaded
  constants.elements.groupChange.forEach(
    element => element.addEventListener(
      "change",
      () => handleSearchCommand(constants, variables)
    )
  );

  // If text color is red then set to default color
  const setDefaultTextColor = ({ elements }) => {
    const { commandSelect, extendedCommandSelect } = elements;
    if (commandSelect.classList.contains("text-danger") || extendedCommandSelect.classList.contains("text-danger")) {
      commandSelect.classList.remove("text-danger");
      extendedCommandSelect.classList.remove("text-danger");
    }
  };

  // Reset all values
  const resetValues = ({ elements }) => {
    const { commandSelect, extendedCommandSelect, tableBody } = elements;
    commandSelect.value = -1;
    extendedCommandSelect.value = -1;
    tableBody.innerHTML = ""; // Remove tr/td tags from table
  };

  // Handler for load module if "Choose file" was clicked
  const handleLoadModule = (constants, variables) => {
    variables.isFileLoaded = false;
    const { inputGroupFile01 } = constants.elements;
    const input = inputGroupFile01.files;
    // const files = (input.length);
    const file = input[0];
    // const filename = input[0].name;
    // const filesize = input[0].size;
    // const filetype = input[0].type;
    const reader = new FileReader();
    reader.onload = event => variables.fileContent = event.target.result;
    reader.readAsBinaryString(file);

    // Handler to wait until module is loaded
    const handleWaitForLoad = (constants, variables) => {
      variables.isFileLoaded = true;
      resetValues(constants);
      reader.removeEventListener(
        "load",
        handleWaitForLoad
      );
    };
    // Add handler for wait until module is loaded
    reader.addEventListener(
      "load",
      () => handleWaitForLoad(constants, variables)
    );
  };
  // Add handler for load module if "Choose file" button was clicked
  constants.elements.inputGroupFile01.addEventListener(
    "change",
    () => handleLoadModule(constants, variables)
  );

  // Handler for set extended command number to 0 if command number E was selected
  const handleCheckCommand = (constants, setDefaultTextColor) => {
    const { commandSelect, extendedCommandSelect } = constants.elements;
    commandSelect.value === 14 ? extendedCommandSelect.value = 0 : extendedCommandSelect.value = -1;
    setDefaultTextColor(constants);
  };
  // Add handler for set extended command number to 0 if command number E was selected
  constants.elements.commandSelect.addEventListener(
    "change",
    () => handleCheckCommand(constants, setDefaultTextColor)
  );

  // Handler for set command number to hex E if extended command number was selected
  const handleCheckExtendedCommand = (constants, setDefaultTextColor) => {
    const { commandSelect, extendedCommandSelect } = constants.elements;
    extendedCommandSelect.value === -1 ? commandSelect.value = -1 : commandSelect.value = 14;
    setDefaultTextColor(constants);
  };
  // Add handler for set command number to hex E if extended command number was selected
  constants.elements.extendedCommandSelect.addEventListener(
    "change",
    () => handleCheckExtendedCommand(constants, setDefaultTextColor)
  );

  // Handler for pressed key to set command number
  const handleGetKeyCommand = ({ which, keyCode }, constants, variables) => {
    const { shortkeyTable, shortkeyIndexTable, elements } = constants;
    const { commandSelect, extendedCommandSelect } = elements;
    const character = which || keyCode;
    for (let i = 0; i < shortkeyTable.length; i++) {
      if (shortkeyTable[i] === character) {
        (commandSelect.value = shortkeyIndexTable[i]) === 14 ? extendedCommandSelect.value = 0 : extendedCommandSelect.value = -1;
        setDefaultTextColor(constants);
        break;
      }
    }
    handleSearchCommand(constants, variables);
  };
  // Handler for manual key mode to set command number
  const handleSetManualCommand = (constants, variables) => {
    const { commandSearchContainer } = constants.elements;
    commandSearchContainer.focus();
    // Add handler to get pressed key to set command number
    commandSearchContainer.addEventListener(
      "keypress",
      (event) => handleGetKeyCommand(event, constants, variables)
    );
  };
  // Add handler to for manual key mode to set command number
  constants.elements.commandSearchContainer.addEventListener(
    "mouseenter",
    () => handleSetManualCommand(constants, variables)
  );
  // Handler for mouse leave command number
  const handleMouseLeaveCommand = ({ elements }) => {
    const { commandSearchContainer } = elements;
    commandSearchContainer.blur();
    // Remove handler to get pressed key source note
    commandSearchContainer.removeEventListener(
      "keypress",
      handleGetKeyCommand
    );
  };
  // Add handler for mouse leave to set command number
  constants.elements.commandSearchContainer.addEventListener(
    "mouseleave",
    () => handleMouseLeaveCommand(constants)
  );

  // Handler for pressed key to set extended command number
  const handleGetKeyExtendedCommand = ({ which, keyCode }, constants, variables) => {
    const { shortkeyTable, shortkeyIndexTable, elements } = constants;
    const { commandSelect, extendedCommandSelect } = elements;
    const character = which || keyCode;
    for (let i = 0; i < shortkeyTable.length; i++) {
      if (shortkeyTable[i] === character) {
        extendedCommandSelect.value = shortkeyIndexTable[i];
        commandSelect.value = 14;
        setDefaultTextColor(constants);
        break;
      }
    }
    handleSearchCommand(constants, variables);
  };
  // Handler for manual key mode to set extended command number
  const handleSetManualExtendedCommand = (constants, variables) => {
    const { extendedCommandSearchContainer } = constants.elements;
    extendedCommandSearchContainer.focus();
    // Add handler to get pressed key to set extended command number
    extendedCommandSearchContainer.addEventListener(
      "keypress",
      event => handleGetKeyExtendedCommand(event, constants, variables)
    );
  };
  // Add handler to for manual key mode to set extended command number
  constants.elements.extendedCommandSearchContainer.addEventListener(
    "mouseenter",
    () => handleSetManualExtendedCommand(constants, variables)
  );
  // Handler for mouse leave extended command number
  const handleMouseLeaveExtendedCommand = ({ elements }) => {
    const { extendedCommandSearchContainer } = elements;
    extendedCommandSearchContainer.blur();
    // Remove handler to get pressed key source note
    extendedCommandSearchContainer.removeEventListener(
      "keypress",
      handleGetKeyExtendedCommand
    );
  };
  // Add handler for mouse leave to set extended command number
  constants.elements.extendedCommandSearchContainer.addEventListener(
    "mouseleave",
    () => handleMouseLeaveExtendedCommand(constants)
  );
}

// Add handler for SearchFxCmd
document.addEventListener(
  "DOMContentLoaded",
  handleSearchFxCmd,
  false
);