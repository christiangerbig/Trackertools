// Handler for SearchFxCmd
const handleSearchFxCmd = () => {
  // ---------- Global ----------

  // Init classes
  class ScanObject {
    constructor(fileContent ,patternNumber, highestPatternNumber, commandNumber, extendedCommandNumber, commandLowByte, searchCommandNumber, searchExtendedCommandNumber) {
      this.fileContent = fileContent;
      this.patternNumber = patternNumber;
      this.highestPatternNumber = highestPatternNumber;
      this.commandNumber = commandNumber;
      this.extendedCommandNumber = extendedCommandNumber;
      this.commandLowbyte = commandLowByte;
      this.searchCommandNumber = searchCommandNumber;
      this.searchExtendedCommandNumber = searchExtendedCommandNumber;
    }
  }

  class ElementsObject {
    constructor(inputGroupFile01, commandSelect, extendedCommandSelect, commandSearchContainer, extendedCommandSearchContainer, tableBody, tr, td, groupChange) {
      this.inputGroupFile01 = inputGroupFile01;
      this.commandSelect = commandSelect;
      this.extendedCommandSelect = extendedCommandSelect;
      this.commandSearchContainer = commandSearchContainer;
      this.extendedCommandSearchContainer = extendedCommandSearchContainer;
      this.tableBody = tableBody;
      this.tr = tr;
      this.td = td;
      this.groupChange = groupChange;
    }
  }

  // Arrays
  shortkeyTable = [
    /* Character codes for command numbers
    0   1   2   3   4   5   6   7   8   9   A   B   C   D    E    F */
    48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 97, 98, 99, 100, 101, 102
  ];

  shortkeyIndexTable = [
    /* Index for command and extended command numbers
    0  1  2  3  4  5  6  7  8  9  A   B   C   D   E   F */
    0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15
  ];

  // Init objects
  const scan = new ScanObject(
    "",
    0,
    0,
    0,
    0,
    0,
    0,
    0
  );

  const elements = new ElementsObject(
    document.querySelector("#inputGroupFile01"),
    document.querySelector("#commandSelect"),
    document.querySelector("#extendedCommandSelect"),
    document.querySelector("#commandSearchContainer"),
    document.querySelector("#extendedCommandSearchContainer"),
    document.querySelector("#tableBody"),
    null,
    null,
    document.querySelectorAll(".groupChange")
  );

    // Constants
  const { inputGroupFile01, commandSelect, extendedCommandSelect, commandSearchContainer, extendedCommandSearchContainer, tableBody, groupChange } = elements;

  const songLengthOffset = 950;
  const songPositionOffset = 952;
  const patternStartOffset = 1084;
  const commandOffset = 2;
  const commandLowbyteOffset = 3;

  const positionTableLength = 128;
  const maxPatternPosition = 64;
  const maxChannels = 4;
  const patternLength = maxPatternPosition * maxChannels;
  const noteDataLength = 4;
  const patternRowLength = noteDataLength * maxChannels
  const commandNumberMask = 0xF;

  // If text color is red then set to default color
  const setDefaultTextColor = () => {
    if (commandSelect.classList.contains("text-danger") || extendedCommandSelect.classList.contains("text-danger")) {
      commandSelect.classList.remove("text-danger");
      extendedCommandSelect.classList.remove("text-danger");
    }
  }

  // Reset all values
  const resetValues = () => {
    commandSelect.value = -1;
    extendedCommandSelect.value = -1;
    tableBody.innerHTML = ""; // Remove all tr/td tags in the table
  }

  // Handler for load module if "Choose file" was clicked
  const handleLoadModule = () => {
    const input = inputGroupFile01.files;
    // let files = (input.length);
    const file = input[0];
    // const filename = input[0].name;
    // const filesize = input[0].size;
    // const filetype = input[0].type;
    const reader = new FileReader();
    reader.readAsBinaryString(file);
    reader.onload = (e) => scan.fileContent = e.target.result;
    resetValues();

    // Handler to wait until module is loaded
    const handleWaitForLoad = () => {
      reader.removeEventListener(
        "load",
        handleWaitForLoad
      );
    }
    // Add handler for wait until module is loaded
    reader.addEventListener(
      "load",
      handleWaitForLoad
    );
  }
  // Add handler for load module if "Choose file" button was clicked
  inputGroupFile01.addEventListener(
    "change",
    handleLoadModule
  );

  // Handler for set extended command number to 0 if command number E was selected
  const handleCheckCommandNumber = () => {
    (commandSelect.value == 14) ? extendedCommandSelect.value = 0 : extendedCommandSelect.value = -1;
    setDefaultTextColor()
  }
  // Add handler for set extended command number to 0 if command number E was selected
  commandSelect.addEventListener(
    "change",
    handleCheckCommandNumber
  );

  // Handler for set command number to hex E if extended command number was selected
  const handleCheckExtendedCommandNumber = () => {
    (extendedCommandSelect.value == -1) ? commandSelect.value = -1 : commandSelect.value = 14;
    setDefaultTextColor();
  }
  // Add handler for set command number to hex E if extended command number was selected
  extendedCommandSelect.addEventListener(
    "change",
    handleCheckExtendedCommandNumber
  );

  // Handler for pressed key to set command number
  const handleGetKeyCommandNumber = (e) => {
    let character = e.which || e.keyCode;
    for (i = 0; i < shortkeyTable.length; i++) {
      if (shortkeyTable[i] === character) {
        let shortkeyIndex = shortkeyIndexTable[i]
        commandSelect.value = shortkeyIndex;
        (shortkeyIndex === 14) ? extendedCommandSelect.value = 0 : extendedCommandSelect.value = -1;
        setDefaultTextColor();
        break;
      }
    }
    handleSearchCommand();
  }
  // Handler for manual key mode to set command number
  const handleSetManualCommandNumber = () => {
    commandSearchContainer.focus();
    // Add handler to get pressed key to set command number
    commandSearchContainer.addEventListener(
      "keypress",
      handleGetKeyCommandNumber
    );
  }
  // Add handler to for manual key mode to set command number
  commandSearchContainer.addEventListener(
    "mouseenter",
    handleSetManualCommandNumber
  );
  // Handler for mouse leave command number
  const handleMouseLeaveCommandNumber = () => {
    commandSearchContainer.blur();
    // Remove handler to get pressed key source note
    commandSearchContainer.removeEventListener(
      "keypress",
      handleGetKeyCommandNumber
    );
  }
  // Add handler for mouse leave to set command number
  commandSearchContainer.addEventListener(
    "mouseleave",
    handleMouseLeaveCommandNumber
  );

  // Handler for pressed key to set extended command number
  const handleGetKeyExtendedCommand = (e) => {
    let character = e.which || e.keyCode;
    for (i = 0; i < shortkeyTable.length; i++) {
      if (shortkeyTable[i] === character) {
        extendedCommandSelect.value = shortkeyIndexTable[i];
        commandSelect.value = 14;
        setDefaultTextColor();
        break;
      }
    }
    handleSearchCommand();
  }
  // Handler for manual key mode to set extended command number
  const handleSetManualExtendedCommand = () => {
    extendedCommandSearchContainer.focus();
    // Add handler to get pressed key to set extended command number
    extendedCommandSearchContainer.addEventListener(
      "keypress",
      handleGetKeyExtendedCommand
    );
  }
  // Add handler to for manual key mode to set extended command number
  extendedCommandSearchContainer.addEventListener(
    "mouseenter",
    handleSetManualExtendedCommand
  );
  // Handler for mouse leave extended command number
  const handleMouseLeaveExtendedCommand = () => {
    extendedCommandSearchContainer.blur();
    // Remove handler to get pressed key source note
    extendedCommandSearchContainer.removeEventListener(
      "keypress",
      handleGetKeyExtendedCommand
    );
  }
  // Add handler for mouse leave to set command number
  extendedCommandSearchContainer.addEventListener(
    "mouseleave",
    handleMouseLeaveExtendedCommand
  );

  // Handler for search command in patterns if module was a loaded
  const handleSearchCommand = () => {

    // Fill the table with the values: Position, Pattern, Patternrow and Channel number
    const outputDataToTable = (i, j, k) => {

      // Append <td> element
      const appendTdElement = (text) => {
        elements.td = document.createElement("td");
        elements.td.innerHTML = text.toString();
        elements.tr.append(elements.td);
      }

      // Append <tr> element
      elements.tr = document.createElement("tr");
      tableBody.append(elements.tr);
      // Append <td> {{ i }} </td> element
      appendTdElement(i);
      // Append <td> {{ pattern }} </td> element
      appendTdElement(scan.patternNumber);
      // Append <td> {{ j / patternRowLength }} </td> element
      appendTdElement(j / patternRowLength);
      // Append <td> {{ ( (k / noteDataLength) + 1 }}  </td> element
      appendTdElement(k / noteDataLength);
    }
    if (scan.fileContent.length) {

      // Get highest pattern number in pattern position table
      const getHighestPattern = () => {
        for (i = 0; i < positionTableLength; i++) {
          scan.patternNumber = scan.fileContent[songPositionOffset + i].charCodeAt(0);
          if (scan.patternNumber > scan.highestPatternNumber) {
            scan.highestPatternNumber = scan.patternNumber;
          }
        }
        scan.highestPatternNumber ++; // Count starts at 0
      }

      // Get button values and convert them to integers
      const getInputElementValues = () => {
        scan.searchCommandNumber = parseInt(commandSelect.value);
        scan.searchExtendedCommandNumber = parseInt(extendedCommandSelect.value);
      }

      // Scan for commands in Mod file
      const scanModFile = () => {
        if (scan.searchCommandNumber === -1) {
          if (!commandSelect.classList.contains("text-danger") || extendedCommandSelect.classList.contains("text-danger")) {
            commandSelect.classList.add("text-danger");
            extendedCommandSelect.classList.add("text-danger");
          }
        }
        else {
          let songLength = scan.fileContent[songLengthOffset].charCodeAt(0);
          let patternOffset = 0;
          let commandNumberIndex = 0;
          let extendedCommandNumberIndex = 0;
          tableBody.innerHTML = ""; // Remove all <tr>/<td> tags in the table
          // Search command or extended command by number
          for (i = 0; i < songLength; i++) {
            scan.patternNumber = scan.fileContent[(songPositionOffset + i)].charCodeAt(0);
            patternOffset = (scan.patternNumber * patternLength * noteDataLength); // Pattern offset in song structure
            for (j = 0; j < (maxPatternPosition * patternRowLength); j += patternRowLength) { // 16th steps per row
              for (k = 0; k < (maxChannels * noteDataLength); k += noteDataLength) { // 4th steps per channel
                commandNumberIndex = (patternStartOffset + patternOffset + j + k + commandOffset);
                scan.commandNumber = scan.fileContent[commandNumberIndex].charCodeAt(0) & commandNumberMask; // Mask out upper nibble
                if (scan.commandNumber === scan.searchCommandNumber && scan.commandNumber !== 14) {
                  if (scan.commandNumber === 0 && scan.searchCommandNumber === 0) {
                    commandNumberIndex = (patternStartOffset + patternOffset + j + k + commandLowbyteOffset);
                    scan.commandLowbyte = scan.fileContent[commandNumberIndex].charCodeAt(0);
                    if (scan.commandLowbyte > 0) {
                      outputDataToTable(i, j, k, scan.patternNumber);
                    }
                  }
                  else {
                    outputDataToTable(i, j, k, scan.patternNumber);
                  }
                }
                if (scan.commandNumber === 14) {
                  extendedCommandNumberIndex = (patternStartOffset + patternOffset + j + k + commandLowbyteOffset);
                  scan.extendedCommandNumber = scan.fileContent[extendedCommandNumberIndex].charCodeAt(0) >> 4; // Shift extended command number to lower nibble		
                  if (scan.extendedCommandNumber === scan.searchExtendedCommandNumber) {
                    outputDataToTable(i, j, k, scan.patternNumber);
                  }
                }
              }
            }
          }
        }
      }
      getHighestPattern();
      getInputElementValues();
      scanModFile();
    }
  }
  // Add handler for search command in patterns if module was a loaded
  groupChange.forEach(
    (element) => element.addEventListener(
      "change", 
      handleSearchCommand
    )
  );
}

// Add handler for SearchFxCmd
document.addEventListener(
  "DOMContentLoaded",
  handleSearchFxCmd,
  false
);