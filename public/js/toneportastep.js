// Handler for TonePortaStep
const handleTonePortaStep = () => {
  // ---------- Global ----------
  const definedTics = 6;
  const definedCommands = 1;
  const definedTooltipText = "Number of units ranges from hex 01 to FF";

  class NoteObject {
    constructor(periodIndex, octaveIndex, finetuneIndex, periodsTableIndex, period) {
      this.periodIndex = periodIndex;
      this.octaveIndex = octaveIndex;
      this.finetuneIndex = finetuneIndex;
      this.periodsTableIndex = periodsTableIndex;
      this.period = period;
    }
  };

  const shortkeyTable = [
    /* Character codes for note period
    C   C#  D    D#  E    F    F#  G    G#  A   A#  B */
    99, 67, 100, 68, 101, 102, 70, 103, 71, 97, 65, 98,
    /* Character codes for octaves 
    1   2   3 */
    49, 50, 51
  ];

  const shortkeyIndexTable = [
    /* index for note period
    C  C# D  D# E  F  F# G  G# A  A#  B */
    0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11,
    /* index for octaves
    1  2  3 */
    0, 1, 2
  ];

  const elements = {
    sourceNoteSelect: document.querySelector("#sourceNoteSelect"),
    sourceOctaveSelect: document.querySelector("#sourceOctaveSelect"),
    sourceFinetuneSelect: document.querySelector("#sourceFinetuneSelect"),
    sourceNoteContainer: document.querySelector("#sourceNoteContainer"),
    destinationNoteSelect: document.querySelector("#destinationNoteSelect"),
    destinationOctaveSelect: document.querySelector("#destinationOctaveSelect"),
    destinationFinetuneSelect: document.querySelector("#destinationFinetuneSelect"),
    destinationNoteContainer: document.querySelector("#destinationNoteContainer"),
    ticsButton: document.querySelector("#ticsButton"),
    commandsButton:  document.querySelector("#commandsButton"),
    unitsResult: document.querySelector("#unitsResult"),
    resetButton: document.querySelector("#resetButton"),
    groupChange: document.querySelectorAll(".groupChange")
  };

  const sourceNote = new NoteObject(0, 0, 0, 0, 0);

  const destinationNote = new NoteObject(0, 0, 0, 0, 0);

  const calculation = {
    tics: definedTics,
    commands: definedCommands,
    periodDiff: 0,
    ticsPeriodDiff: 0,
    commandsPeriodDiff: 0,
    commandUnits: 0
  };

  const {sourceNoteSelect, sourceOctaveSelect, sourceFinetuneSelect, sourceNoteContainer, destinationNoteSelect, destinationOctaveSelect, destinationFinetuneSelect, destinationNoteContainer, ticsButton, commandsButton, unitsResult, resetButton, groupChange} = elements;

  // Set text color from red to default
  const setDefaultTextColour = () => {
    if (unitsResult.classList.contains("text-danger")) {
      unitsResult.classList.remove("text-danger");
      unitsResult.classList.add("textColored");
    }
  }

  // Handler for switch destination finetune to source finetune value
  const handleSwitchDestinationFinetune = () => destinationFinetuneSelect.value = sourceFinetuneSelect.value

  // Add handler for change finetune value
  sourceFinetuneSelect.addEventListener(
    "click",
    handleSwitchDestinationFinetune
  );

  // Handler for switch source finetune to destination finetune value
  const handleSwitchSourceFinetune = () => sourceFinetuneSelect.value = destinationFinetuneSelect.value
  
  // Add handler for change finetune value
  destinationFinetuneSelect.addEventListener(
    "click",
    handleSwitchSourceFinetune
  );

  // Handler for pressed key source note
  const handleGetKeySource = event => {
    const chararacter = event.which || event.keyCode;
    for (let i = 0; i < shortkeyTable.length; i++) {
      if (shortkeyTable[i] === chararacter) {
        if (chararacter >= 65) {
          sourceNoteSelect.value = shortkeyIndexTable[i];
          break;
        }
        else {
          sourceOctaveSelect.value = shortkeyIndexTable[i];
          break;
        }
      }
    }
    handleCalculateValue();
  }
  // Handler for manual key mode to set source note without finetune
  const handleSetSourceNote = () => {
    sourceNoteContainer.focus();
    // Add handler to get pressed key source note
    sourceNoteContainer.addEventListener(
      "keypress",
      handleGetKeySource
    );
  }
  // Add handler to set source note
  sourceNoteContainer.addEventListener(
    "mouseenter",
    handleSetSourceNote
  );
  // Handler for mouse leave source note
  const handleMouseLeaveSource = () => {
    sourceNoteContainer.blur();
    // Remove handler to get pressed key source note
    sourceNoteContainer.removeEventListener(
      "keypress",
      handleGetKeySource
    );
  }
  // Add handler for mouse leave source note
  sourceNoteContainer.addEventListener(
    "mouseleave",
    handleMouseLeaveSource
  );

  // Handler for pressed key destination note
  const handleGetKeyDestination = event => {
    const character = event.which || event.keyCode;
    for (let i = 0; i < shortkeyTable.length; i++) {
      if (shortkeyTable[i] === character) {
        if (character >= 65) {
          destinationNoteSelect.value = shortkeyIndexTable[i];
          break;
        }
        else {
          destinationOctaveSelect.value = shortkeyIndexTable[i];
          break;
        }
      }
    }
    handleCalculateValue();
  }
  // Manual key mode to set destination note without finetune
  const handleSetDestinationNote = () => {
    destinationNoteContainer.focus();
    // Add handler to get pressed key destination note
    destinationNoteContainer.addEventListener(
      "keypress",
      handleGetKeyDestination
    );
  }
  // Add handler to set destination note
  destinationNoteContainer.addEventListener(
    "mouseenter",
    handleSetDestinationNote
  );
  // Handler for mouse leave destination note
  const handleMouseLeaveDestination = () => {
    destinationNoteContainer.blur();
    // Remove handler to get pressed key destination note
    destinationNoteContainer.removeEventListener(
      "keypress",
      handleGetKeyDestination
    );
  }
  // Add handler for mouse leave destination note
  destinationNoteContainer.addEventListener(
    "mouseleave",
    handleMouseLeaveDestination
  );

  // Handler for value calculation
  const handleCalculateValue = () => {

    // Init arrays
    const periodsTable = [
      /* Tuning 0, normal
      C    C#   D    D#   E    F    F#   G    G#   A    A#   B */
      856, 808, 762, 720, 678, 640, 604, 570, 538, 508, 480, 453, // oct 1
      428, 404, 381, 360, 339, 320, 302, 285, 269, 254, 240, 226, // oct 2
      214, 202, 190, 180, 170, 160, 151, 143, 135, 127, 120, 113, // oct 3
      // Tuning 1
      850, 802, 757, 715, 674, 637, 601, 567, 535, 505, 477, 450,
      425, 401, 379, 357, 337, 318, 300, 284, 268, 253, 239, 225,
      213, 201, 189, 179, 169, 159, 150, 142, 134, 126, 119, 113,
      // Tuning 2
      844, 796, 752, 709, 670, 632, 597, 563, 532, 502, 474, 447,
      422, 398, 376, 355, 335, 316, 298, 282, 266, 251, 237, 224,
      211, 199, 188, 177, 167, 158, 149, 141, 133, 125, 118, 112,
      // Tuning 3
      838, 791, 746, 704, 665, 628, 592, 559, 528, 498, 470, 444,
      419, 395, 373, 352, 332, 314, 296, 280, 264, 249, 235, 222,
      209, 198, 187, 176, 166, 157, 148, 140, 132, 125, 118, 111,
      // Tuning 4
      832, 785, 741, 699, 660, 623, 588, 555, 524, 495, 467, 441,
      416, 392, 370, 350, 330, 312, 294, 278, 262, 247, 233, 220,
      208, 196, 185, 175, 165, 156, 147, 139, 131, 124, 117, 110,
      // Tuning 5
      826, 779, 736, 694, 655, 619, 584, 551, 520, 491, 463, 437,
      413, 390, 368, 347, 328, 309, 292, 276, 260, 245, 232, 219,
      206, 195, 184, 174, 164, 155, 146, 138, 130, 123, 116, 109,
      // Tuning 6
      820, 774, 730, 689, 651, 614, 580, 547, 516, 487, 460, 434,
      410, 387, 365, 345, 325, 307, 290, 274, 258, 244, 230, 217,
      205, 193, 183, 172, 163, 154, 145, 137, 129, 122, 115, 109,
      // Tuning 7
      814, 768, 725, 684, 646, 610, 575, 543, 513, 484, 457, 431,
      407, 384, 363, 342, 323, 305, 288, 272, 256, 242, 228, 216,
      204, 192, 181, 171, 161, 152, 144, 136, 128, 121, 114, 108,
      // Tuning -8
      907, 856, 808, 762, 720, 678, 640, 604, 570, 538, 508, 480,
      453, 428, 404, 381, 360, 339, 320, 302, 285, 269, 254, 240,
      226, 214, 202, 190, 180, 170, 160, 151, 143, 135, 127, 120,
      // Tuning -7
      900, 850, 802, 757, 715, 675, 636, 601, 567, 535, 505, 477,
      450, 425, 401, 379, 357, 337, 318, 300, 284, 268, 253, 238,
      225, 212, 200, 189, 179, 169, 159, 150, 142, 134, 126, 119,
      // Tuning -6
      894, 844, 796, 752, 709, 670, 632, 597, 563, 532, 502, 474,
      447, 422, 398, 376, 355, 335, 316, 298, 282, 266, 251, 237,
      223, 211, 199, 188, 177, 167, 158, 149, 141, 133, 125, 118,
      // Tuning -5
      887, 838, 791, 746, 704, 665, 628, 592, 559, 528, 498, 470,
      444, 419, 395, 373, 352, 332, 314, 296, 280, 264, 249, 235,
      222, 209, 198, 187, 176, 166, 157, 148, 140, 132, 125, 118,
      // Tuning -4
      881, 832, 785, 741, 699, 660, 623, 588, 555, 524, 494, 467,
      441, 416, 392, 370, 350, 330, 312, 294, 278, 262, 247, 233,
      220, 208, 196, 185, 175, 165, 156, 147, 139, 131, 123, 117,
      // Tuning -3
      875, 826, 779, 736, 694, 655, 619, 584, 551, 520, 491, 463,
      437, 413, 390, 368, 347, 328, 309, 292, 276, 260, 245, 232,
      219, 206, 195, 184, 174, 164, 155, 146, 138, 130, 123, 116,
      // Tuning -2
      868, 820, 774, 730, 689, 651, 614, 580, 547, 516, 487, 460,
      434, 410, 387, 365, 345, 325, 307, 290, 274, 258, 244, 230,
      217, 205, 193, 183, 172, 163, 154, 145, 137, 129, 122, 115,
      // Tuning -1
      862, 814, 768, 725, 684, 646, 610, 575, 543, 513, 484, 457,
      431, 407, 384, 363, 342, 323, 305, 288, 272, 256, 242, 228,
      216, 203, 192, 181, 171, 161, 152, 144, 136, 128, 121, 114
    ];

    // Init constants
    const semiToneOctaves = 12;
    const octaves = 3;
    const semiTones = semiToneOctaves * octaves;
    const maxUnits = 255;
    const outputErrorText = "**";
    const tooltipErrorText = "Calculated number of units is greater than hex FF";

    // Init variables
    let tooltipText = definedTooltipText;

    // Get input element values and convert them to integers
    const getInputElementsValues = () => {
      sourceNote.periodIndex = parseInt(sourceNoteSelect.value);
      sourceNote.octaveIndex = parseInt(sourceOctaveSelect.value);
      sourceNote.finetuneIndex = parseInt(sourceFinetuneSelect.value);
      destinationNote.periodIndex = parseInt(destinationNoteSelect.value);
      destinationNote.octaveIndex = parseInt(destinationOctaveSelect.value);
      destinationNote.finetuneIndex = parseInt(destinationFinetuneSelect.value);
      calculation.tics = (parseInt(ticsButton.value))
      calculation.tics --; // Without first tick
      calculation.commands = parseInt(commandsButton.value);
    }

    // Read period values from table
    const getPeriodValues = () => {
      sourceNote.periodsTableIndex = sourceNote.periodIndex + (sourceNote.octaveIndex * semiToneOctaves) + (sourceNote.finetuneIndex * semiTones);
      sourceNote.period = periodsTable[sourceNote.periodsTableIndex]; // Source period
      destinationNote.periodsTableIndex = destinationNote.periodIndex + (destinationNote.octaveIndex * semiToneOctaves) + (destinationNote.finetuneIndex * semiTones);
      destinationNote.period = periodsTable[destinationNote.periodsTableIndex]; // Destination period
    }

    // Calculate units per command
    const calculateUnits = () => {
      calculation.periodDiff = Math.abs(destinationNote.period - sourceNote.period);
      calculation.ticsPeriodDiff = Math.ceil(calculation.periodDiff / calculation.tics);
      calculation.commandsPeriodDiff = Math.ceil(calculation.ticsPeriodDiff / calculation.commands);
    }

    // Output units per command
    const outputUnits = () => {
      tooltipText = definedTooltipText;
      if (calculation.commandsPeriodDiff <= maxUnits) {
        calculation.commandUnits = calculation.commandsPeriodDiff.toString(16).padStart(2, 0, 0).toUpperCase();
        setDefaultTextColour();
      }
      else {
        calculation.commandUnits = outputErrorText;
        tooltipText = tooltipErrorText;
        if (unitsResult.classList.contains("textColored")) {
          unitsResult.classList.remove("textColored");
          unitsResult.classList.add("text-danger");
        }
      }
      unitsResult.innerHTML = calculation.commandUnits;
      unitsResult.title = tooltipText;
    }

    getInputElementsValues();
    getPeriodValues();
    calculateUnits();
    outputUnits();
  }
  // Add handler for value calculation
  groupChange.forEach(
    element => element.addEventListener(
      "change", 
      handleCalculateValue
    )
  );

  // Reset all values
  const handleResetButton = () => {
    sourceNoteSelect.value = 0;
    sourceOctaveSelect.value = 0;
    sourceFinetuneSelect.value = 0;
    destinationNoteSelect.value = 0;
    destinationOctaveSelect.value = 0;
    destinationFinetuneSelect.value = 0;
    ticsButton.value = definedTics;
    commandsButton.value = definedCommands;
    unitsResult.innerHTML = "00";
    unitsResult.title = definedTooltipText;
    setDefaultTextColour();
  }
  // Add handler for click on reset button
  resetButton.addEventListener(
    "click",
    handleResetButton
  );
}

// Add handler for TonePortaStep
document.addEventListener(
  "DOMContentLoaded",
  handleTonePortaStep,
  false
);