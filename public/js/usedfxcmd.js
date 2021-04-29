// ---------- UsedFxCmd ----------
const usedFxCmd = () => {
  // ---------- Global ---------

  // Initialize classes
  class ScanObject {
    constructor(fileContent, patternNumber, highestPatternNumber, commandNumber, extendedCommandNumber, commandLowbyte) {
      this.fileContent = fileContent;
      this.patternNumber = patternNumber;
      this.highestPatternNumber = highestPatternNumber;
      this.commandNumber = commandNumber;
      this.extendedCommandNumber = extendedCommandNumber;
      this.commandLowbyte = commandLowbyte;
    }
  }

  class ElementsObject {
    constructor(inputGroupFile01, commandsTableBody, extendedCommandsTableBody, tr, td) {
      this.inputGroupFile01 = inputGroupFile01;
      this.commandsTableBody = commandsTableBody;
      this.extendedCommandsTableBody = extendedCommandsTableBody;
      this.tr = tr;
      this.td = td;
    }
  }

  // Initialize objects
  const elements = new ElementsObject(
    document.querySelector("#inputGroupFile01"),
    document.querySelector("#commandsTableBody"),
    document.querySelector("#extendedCommandsTableBody"),
    null,
    null
  );

  const scan = new ScanObject(
    "",
    0,
    0,
    0,
    0,
    0
  );

  // Initialize constants
  const { inputGroupFile01, commandsTableBody, extendedCommandsTableBody } = elements;

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
  const patternRowLength = noteDataLength * maxChannels;
  const maxCommands = 16;
  const maxExtendedCommands = 16;
  const commandNumberMask = 0xF;

  // Reset all and remove all tr/td tags in the table
  const resetValues = () => {
    commandsTableBody.innerHTML = ""; 
    extendedCommandsTableBody.innerHTML = "";
  }

  // Handler for scan commands in patterns
  const handleScanCommands = () => {
      // Initialize arrays

      // Command names
      commandNamesTable = [
        "0 - Arpeggio",
        "1 - Portamento Up",
        "2 - Portamento Down",
        "3 - Tone Portamento",
        "4 - Vibrato",
        "5 - Tone Porta & Vol Slide",
        "6 - Vib & Vol Slide",
        "7 - Tremolo",
        "8 - NOT USED / custom",
        "9 - Set Sample Offset",
        "A - Volume Slide",
        "B - Position Jump",
        "C - Set Volume",
        "D - Pattern Break",
        "E - Ext commands",
        "F - Set Speed"
      ];

      // Extended command names
      extendedCommandNamesTable = [
        "E0 - Set Filter",
        "E1 - Fine Porta Up",
        "E2 - Fine Porta Down",
        "E3 - Set Gliss Control",
        "E4 - Set Vib Waveform",
        "E5 - Set Samp Finetune",
        "E6 - Jump to Loop",
        "E7 - Set Trem Waveform",
        "E8 - Karplus Strong",
        "E9 - Retrig Note",
        "EA - Fine Vol Slide Up",
        "EB - Fine Vol Slide Down",
        "EC - Note Cut",
        "ED - Note Delay",
        "EE - Pattern Delay",
        "EF - Invert Loop"
      ];

      // Command found states
      const commandsStateTable = new Array(16).fill(false);
      
      // Extended command found states
      const extendedCommandsStateTable = new Array(16).fill(false);

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

      // Scan mod file for commands and extended commands by number
      const scanModFile = () => {
        let songLength = scan.fileContent[songLengthOffset].charCodeAt(0);
        let patternOffset = 0;
        let commandNumberIndex = 0;
        let extendedCommandNumberIndex = 0;
        resetValues();
        for (i = 0; i < songLength; i++) {
          scan.patternNumber = scan.fileContent[(songPositionOffset + i)].charCodeAt(0);
          patternOffset = (scan.patternNumber * patternLength * noteDataLength); // Pattern offset in song structure
          for (j = 0; j < (maxPatternPosition * patternRowLength); j += patternRowLength) { // 16th steps per row
            for (k = 0; k < (maxChannels * noteDataLength); k += noteDataLength) { // 4th steps per channel
              commandNumberIndex = (patternStartOffset + patternOffset + j + k + commandOffset);
              scan.commandNumber = scan.fileContent[commandNumberIndex].charCodeAt(0) & commandNumberMask // Mask out upper nibble
              if (scan.commandNumber !== 14) {
                if (scan.commandNumber === 0) {
                  commandNumberIndex = (patternStartOffset + patternOffset + j + k + commandLowbyteOffset);
                  scan.commandLowbyte = scan.fileContent[commandNumberIndex].charCodeAt(0);
                  if (scan.commandLowbyte > 0) {
                    commandsStateTable[scan.commandNumber] = true;
                  }
                }
                else {
                  commandsStateTable[scan.commandNumber] = true;
                }
              }
              else {
                extendedCommandNumberIndex = (patternStartOffset + patternOffset + j + k + commandLowbyteOffset);
                scan.extendedCommandNumber = scan.fileContent[extendedCommandNumberIndex].charCodeAt(0) >> 4; // Shift extended command number to lower nibble	
                extendedCommandsStateTable[scan.extendedCommandNumber] = true;
                commandsStateTable[14] = true; // Also set extended command
              }
            }
          }
        }
      }

      // Append <td> element in table
      const appendTdElement = (text) => {
        elements.td = document.createElement("td");
        elements.td.innerHTML = text.toString();
        elements.tr.append(elements.td);
      }

    // Output command and extended command names to table
    const outputDataToTable = () => {
      // Fill the table with used command names
      for (i = 0; i < maxCommands; i++) {
        if (commandsStateTable[i]) {
          // Append element <tr class="text-left"> </tr>
          elements.tr = document.createElement("tr");
          elements.tr.classList.add("text-left");
          commandsTableBody.append(elements.tr);
          // Append element <td> {{ commandNamesTable[i] }} </td>
          appendTdElement(commandNamesTable[i]);
        }
      }
      // Fill the table with used extended command names
      for (i = 0; i < maxExtendedCommands; i++) {
        if (extendedCommandsStateTable[i]) {
          // Append element <tr class="text-left"> </tr>
          elements.tr = document.createElement("tr");
          elements.tr.classList.add("text-left");
          extendedCommandsTableBody.append(elements.tr);
          // Append element <td> {{ extendedCommandNamesTable[i] }} </td>
          appendTdElement(extendedCommandNamesTable[i]);
        }
      }
    }
    getHighestPattern();
    scanModFile();
    outputDataToTable();
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
      handleScanCommands();
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
}

// Add handler for UsedFxCmd
document.addEventListener(
  "DOMContentLoaded",
  usedFxCmd,
  false
);