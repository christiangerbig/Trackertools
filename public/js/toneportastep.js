// Handler for TonePortaStep
const handleTonePortaStep = () => {
  // ---------- Global ----------
  const constants = {
    definedTics: 6,
    definedCommands: 1,
    definedTooltipText: "Number of units ranges from hex 01 to FF",
    semiToneOctaves: 12,
    octaves: 3,
    semiTones: 0, // Will be initialized later
    maxUnits: 255,
    outputErrorText: "**",
    tooltipErrorText: "Calculated number of units is greater than hex FF",
    // HTML element objects
    htmlElements: {
      sourceNoteSelect: document.querySelector("#sourceNoteSelect"),
      sourceOctaveSelect: document.querySelector("#sourceOctaveSelect"),
      sourceFinetuneSelect: document.querySelector("#sourceFinetuneSelect"),
      sourceNoteContainer: document.querySelector("#sourceNoteContainer"),
      destinationNoteSelect: document.querySelector("#destinationNoteSelect"),
      destinationOctaveSelect: document.querySelector(
        "#destinationOctaveSelect"
      ),
      destinationFinetuneSelect: document.querySelector(
        "#destinationFinetuneSelect"
      ),
      destinationNoteContainer: document.querySelector(
        "#destinationNoteContainer"
      ),
      ticsButton: document.querySelector("#ticsButton"),
      commandsButton: document.querySelector("#commandsButton"),
      unitsResult: document.querySelector("#unitsResult"),
      resetButton: document.querySelector("#resetButton"),
      groupChange: document.querySelectorAll(".groupChange"),
    },
    // Character codes for note period and octaves
    shortkeyTable: [
      // C  C#  D  D#  E  F  F#  G  G#  A  A#  B
      99, 67, 100, 68, 101, 102, 70, 103, 71, 97, 65, 98,
      // 1  2  3
      49, 50, 51,
    ],
    // Index for note period and octaves
    shortkeyIndexTable: [
      // C  C# D  D# E  F  F# G  G# A  A#  B
      0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11,
      // 1  2  3
      0, 1, 2,
    ],
    // Period values for three octaves and different tunings
    periodsTable: [
      // Tuning 0, normal
      856, 808, 762, 720, 678, 640, 604, 570, 538, 508, 480, 453, 428, 404, 381,
      360, 339, 320, 302, 285, 269, 254, 240, 226, 214, 202, 190, 180, 170, 160,
      151, 143, 135, 127, 120, 113,
      // Tuning 1
      850, 802, 757, 715, 674, 637, 601, 567, 535, 505, 477, 450, 425, 401, 379,
      357, 337, 318, 300, 284, 268, 253, 239, 225, 213, 201, 189, 179, 169, 159,
      150, 142, 134, 126, 119, 113,
      // Tuning 2
      844, 796, 752, 709, 670, 632, 597, 563, 532, 502, 474, 447, 422, 398, 376,
      355, 335, 316, 298, 282, 266, 251, 237, 224, 211, 199, 188, 177, 167, 158,
      149, 141, 133, 125, 118, 112,
      // Tuning 3
      838, 791, 746, 704, 665, 628, 592, 559, 528, 498, 470, 444, 419, 395, 373,
      352, 332, 314, 296, 280, 264, 249, 235, 222, 209, 198, 187, 176, 166, 157,
      148, 140, 132, 125, 118, 111,
      // Tuning 4
      832, 785, 741, 699, 660, 623, 588, 555, 524, 495, 467, 441, 416, 392, 370,
      350, 330, 312, 294, 278, 262, 247, 233, 220, 208, 196, 185, 175, 165, 156,
      147, 139, 131, 124, 117, 110,
      // Tuning 5
      826, 779, 736, 694, 655, 619, 584, 551, 520, 491, 463, 437, 413, 390, 368,
      347, 328, 309, 292, 276, 260, 245, 232, 219, 206, 195, 184, 174, 164, 155,
      146, 138, 130, 123, 116, 109,
      // Tuning 6
      820, 774, 730, 689, 651, 614, 580, 547, 516, 487, 460, 434, 410, 387, 365,
      345, 325, 307, 290, 274, 258, 244, 230, 217, 205, 193, 183, 172, 163, 154,
      145, 137, 129, 122, 115, 109,
      // Tuning 7
      814, 768, 725, 684, 646, 610, 575, 543, 513, 484, 457, 431, 407, 384, 363,
      342, 323, 305, 288, 272, 256, 242, 228, 216, 204, 192, 181, 171, 161, 152,
      144, 136, 128, 121, 114, 108,
      // Tuning -8
      907, 856, 808, 762, 720, 678, 640, 604, 570, 538, 508, 480, 453, 428, 404,
      381, 360, 339, 320, 302, 285, 269, 254, 240, 226, 214, 202, 190, 180, 170,
      160, 151, 143, 135, 127, 120,
      // Tuning -7
      900, 850, 802, 757, 715, 675, 636, 601, 567, 535, 505, 477, 450, 425, 401,
      379, 357, 337, 318, 300, 284, 268, 253, 238, 225, 212, 200, 189, 179, 169,
      159, 150, 142, 134, 126, 119,
      // Tuning -6
      894, 844, 796, 752, 709, 670, 632, 597, 563, 532, 502, 474, 447, 422, 398,
      376, 355, 335, 316, 298, 282, 266, 251, 237, 223, 211, 199, 188, 177, 167,
      158, 149, 141, 133, 125, 118,
      // Tuning -5
      887, 838, 791, 746, 704, 665, 628, 592, 559, 528, 498, 470, 444, 419, 395,
      373, 352, 332, 314, 296, 280, 264, 249, 235, 222, 209, 198, 187, 176, 166,
      157, 148, 140, 132, 125, 118,
      // Tuning -4
      881, 832, 785, 741, 699, 660, 623, 588, 555, 524, 494, 467, 441, 416, 392,
      370, 350, 330, 312, 294, 278, 262, 247, 233, 220, 208, 196, 185, 175, 165,
      156, 147, 139, 131, 123, 117,
      // Tuning -3
      875, 826, 779, 736, 694, 655, 619, 584, 551, 520, 491, 463, 437, 413, 390,
      368, 347, 328, 309, 292, 276, 260, 245, 232, 219, 206, 195, 184, 174, 164,
      155, 146, 138, 130, 123, 116,
      // Tuning -2
      868, 820, 774, 730, 689, 651, 614, 580, 547, 516, 487, 460, 434, 410, 387,
      365, 345, 325, 307, 290, 274, 258, 244, 230, 217, 205, 193, 183, 172, 163,
      154, 145, 137, 129, 122, 115,
      // Tuning -1
      862, 814, 768, 725, 684, 646, 610, 575, 543, 513, 484, 457, 431, 407, 384,
      363, 342, 323, 305, 288, 272, 256, 242, 228, 216, 203, 192, 181, 171, 161,
      152, 144, 136, 128, 121, 114,
    ],
  };

  const {
    semiToneOctaves,
    octaves,
    definedTics,
    definedCommands,
    definedTooltipText,
  } = constants;
  constants.semiTones = semiToneOctaves * octaves;

  class NoteObject {
    constructor(
      periodIndex,
      octaveIndex,
      finetuneIndex,
      periodsTableIndex,
      period
    ) {
      this.periodIndex = periodIndex;
      this.octaveIndex = octaveIndex;
      this.finetuneIndex = finetuneIndex;
      this.periodsTableIndex = periodsTableIndex;
      this.period = period;
    }
  }

  const sourceNote = new NoteObject(0, 0, 0, 0, 0);
  const destinationNote = new NoteObject(0, 0, 0, 0, 0);

  const variables = {
    tics: definedTics,
    commands: definedCommands,
    periodDiff: 0,
    ticsPeriodDiff: 0,
    commandsPeriodDiff: 0,
    commandUnits: 0,
    tooltipText: definedTooltipText,
  };

  // Set text color from red to default
  const setDefaultTextColor = ({ htmlElements }) => {
    const { unitsResult } = htmlElements;
    if (unitsResult.classList.contains("text-danger")) {
      unitsResult.classList.remove("text-danger");
      unitsResult.classList.add("textColored");
    }
  };

  // Handler for switch destination finetune to source finetune value
  const handleSwitchDestinationFinetune = ({ htmlElements }) => {
    const { sourceFinetuneSelect, destinationFinetuneSelect } = htmlElements;
    destinationFinetuneSelect.value = sourceFinetuneSelect.value;
  };
  // Add handler for change finetune value
  constants.htmlElements.sourceFinetuneSelect.addEventListener("click", () =>
    handleSwitchDestinationFinetune(constants)
  );

  // Handler for switch source finetune to destination finetune value
  const handleSwitchSourceFinetune = ({ htmlElements }) => {
    const { sourceFinetuneSelect, destinationFinetuneSelect } = htmlElements;
    sourceFinetuneSelect.value = destinationFinetuneSelect.value;
  };
  // Add handler for change finetune value
  constants.htmlElements.destinationFinetuneSelect.addEventListener(
    "click",
    () => handleSwitchSourceFinetune(constants)
  );

  // Handler for pressed key source note
  const handleGetKeySource = (
    { which, keyCode },
    constants,
    variables,
    { sourceNote, destinationNote },
    setDefaultTextColor
  ) => {
    const chararacter = which || keyCode;
    const { shortkeyTable, shortkeyIndexTable, htmlElements } = constants;
    const { sourceNoteSelect, sourceOctaveSelect } = htmlElements;
    for (let i = 0; i < shortkeyTable.length; i++) {
      if (shortkeyTable[i] === chararacter) {
        if (chararacter >= 65) {
          sourceNoteSelect.value = shortkeyIndexTable[i];
          break;
        } else {
          sourceOctaveSelect.value = shortkeyIndexTable[i];
          break;
        }
      }
    }
    handleCalculateValue(
      constants,
      variables,
      { sourceNote, destinationNote },
      setDefaultTextColor
    )
  };
  // Handler for manual key mode to set source note without finetune
  const handleSetSourceNote = (
    constants,
    variables,
    { sourceNote, destinationNote },
    setDefaultTextColor
  ) => {
    const { sourceNoteContainer } = constants.htmlElements;
    sourceNoteContainer.focus();
    // Add handler to get pressed key source note
    sourceNoteContainer.addEventListener("keypress", (event) =>
      handleGetKeySource(event, constants, variables, {
        sourceNote,
        destinationNote,
      },
      setDefaultTextColor)
    );
  };
  // Add handler to set source note
  constants.htmlElements.sourceNoteContainer.addEventListener(
    "mouseenter",
    () =>
      handleSetSourceNote(constants, variables, { sourceNote, destinationNote }, setDefaultTextColor)
  );
  // Handler for mouse leave source note
  const handleMouseLeaveSource = (constants) => {
    const { sourceNoteContainer } = constants.htmlElements;
    sourceNoteContainer.blur();
    // Remove handler to get pressed key source note
    sourceNoteContainer.removeEventListener("keypress", (event) =>
    handleGetKeySource(event, constants, variables, {
      sourceNote,
      destinationNote,
    },
    setDefaultTextColor)
    );
  };
  // Add handler for mouse leave source note
  constants.htmlElements.sourceNoteContainer.addEventListener(
    "mouseleave",
    () => handleMouseLeaveSource(constants)
  );

  // Handler for pressed key destination note
  const handleGetKeyDestination = (
    { which, keyCode },
    constants,
    variables,
    { sourceNote, destinationNote },
    setDefaultTextColor
  ) => {
    const character = which || keyCode;
    const { shortkeyTable, shortkeyIndexTable, htmlElements } = constants;
    const { destinationNoteSelect, destinationOctaveSelect } = htmlElements;
    for (let i = 0; i < shortkeyTable.length; i++) {
      if (shortkeyTable[i] === character) {
        if (character >= 65) {
          destinationNoteSelect.value = shortkeyIndexTable[i];
          break;
        } else {
          destinationOctaveSelect.value = shortkeyIndexTable[i];
          break;
        }
      }
    }
    handleCalculateValue(
      constants,
      variables,
      { sourceNote, destinationNote },
      setDefaultTextColor
    )
  };
  // Manual key mode to set destination note without finetune
  const handleSetDestinationNote = (
    constants,
    variables,
    { sourceNote, destinationNote },
    setDefaultTextColor
  ) => {
    const { destinationNoteContainer } = constants.htmlElements;
    destinationNoteContainer.focus();
    // Add handler to get pressed key destination note
    destinationNoteContainer.addEventListener("keypress", (event) =>
      handleGetKeyDestination(event, constants, variables, {
        sourceNote,
        destinationNote,
      },
      setDefaultTextColor)
    );
  };
  // Add handler to set destination note
  constants.htmlElements.destinationNoteContainer.addEventListener(
    "mouseenter",
    () =>
      handleSetDestinationNote(constants, variables, {
        sourceNote,
        destinationNote,
      },
      setDefaultTextColor)
  );
  // Handler for mouse leave destination note
  const handleMouseLeaveDestination = (constants) => {
    const { destinationNoteContainer } = constants.htmlElements;
    destinationNoteContainer.blur();
    // Remove handler to get pressed key destination note
    destinationNoteContainer.removeEventListener("keypress", (event) =>
    handleGetKeyDestination(event, constants, variables, {
      sourceNote,
      destinationNote,
    },
    setDefaultTextColor)
    );
  };
  // Add handler for mouse leave destination note
  constants.htmlElements.destinationNoteContainer.addEventListener(
    "mouseleave",
    () => handleMouseLeaveDestination(constants)
  );

  // Handler for value variables
  const handleCalculateValue = (
    constants,
    variables,
    { sourceNote, destinationNote },
    setDefaultTextColor
  ) => {
    // Get input element values and convert them to integers
    const getInputElementsValues = (
      { htmlElements },
      variables,
      { sourceNote, destinationNote }
    ) => {
      const {
        sourceNoteSelect,
        sourceOctaveSelect,
        sourceFinetuneSelect,
        destinationNoteSelect,
        destinationOctaveSelect,
        destinationFinetuneSelect,
        ticsButton,
        commandsButton,
      } = htmlElements;
      sourceNote.periodIndex = parseInt(sourceNoteSelect.value);
      sourceNote.octaveIndex = parseInt(sourceOctaveSelect.value);
      sourceNote.finetuneIndex = parseInt(sourceFinetuneSelect.value);
      destinationNote.periodIndex = parseInt(destinationNoteSelect.value);
      destinationNote.octaveIndex = parseInt(destinationOctaveSelect.value);
      destinationNote.finetuneIndex = parseInt(destinationFinetuneSelect.value);
      variables.tics = parseInt(ticsButton.value);
      variables.tics--; // Without first tick
      variables.commands = parseInt(commandsButton.value);
    };

    // Read period values from table
    const getPeriodValues = (
      { semiTones, semiToneOctaves, periodsTable },
      { sourceNote, destinationNote }
    ) => {
      // Source period
      const getSourcePeriod = (
        { semiTones, semiToneOctaves, periodsTable },
        sourceNote
      ) => {
        const { periodIndex, octaveIndex, finetuneIndex } = sourceNote;
        sourceNote.periodsTableIndex =
          periodIndex +
          octaveIndex * semiToneOctaves +
          finetuneIndex * semiTones;
        sourceNote.period = periodsTable[sourceNote.periodsTableIndex];
      };
      // Destination period
      const getDestinationPeriod = (
        { semiTones, semiToneOctaves, periodsTable },
        destinationNote
      ) => {
        const { periodIndex, octaveIndex, finetuneIndex } = destinationNote;
        destinationNote.periodsTableIndex =
          periodIndex +
          octaveIndex * semiToneOctaves +
          finetuneIndex * semiTones;
        destinationNote.period =
          periodsTable[destinationNote.periodsTableIndex];
      };

      getSourcePeriod({ semiTones, semiToneOctaves, periodsTable }, sourceNote);
      getDestinationPeriod(
        { semiTones, semiToneOctaves, periodsTable },
        destinationNote
      );
    };

    // Calculate units per command
    const calculateUnits = (variables, { sourceNote, destinationNote }) => {
      const { tics, commands } = variables;
      variables.periodDiff = Math.abs(
        destinationNote.period - sourceNote.period
      );
      variables.ticsPeriodDiff = Math.ceil(variables.periodDiff / tics);
      variables.commandsPeriodDiff = Math.ceil(
        variables.ticsPeriodDiff / commands
      );
    };

    // Output units per command
    const outputUnits = (constants, variables, setDefaultTextColor) => {
      const {
        definedTooltipText,
        outputErrorText,
        tooltipErrorText,
        maxUnits,
        htmlElements,
      } = constants;
      const { unitsResult } = htmlElements;
      variables.tooltipText = definedTooltipText;
      const { commandsPeriodDiff } = variables;
      if (commandsPeriodDiff <= maxUnits) {
        variables.commandUnits = commandsPeriodDiff
          .toString(16)
          .padStart(2, 0, 0)
          .toUpperCase();
        setDefaultTextColor(constants);
      } else {
        variables.commandUnits = outputErrorText;
        variables.tooltipText = tooltipErrorText;
        if (unitsResult.classList.contains("textColored")) {
          unitsResult.classList.remove("textColored");
          unitsResult.classList.add("text-danger");
        }
      }
      unitsResult.innerHTML = variables.commandUnits;
      unitsResult.title = variables.tooltipText;
    };

    getInputElementsValues(constants, variables, {
      sourceNote,
      destinationNote,
    });
    getPeriodValues(constants, { sourceNote, destinationNote });
    calculateUnits(variables, { sourceNote, destinationNote });
    outputUnits(constants, variables, setDefaultTextColor);
  };
  // Add handler for value variables
  constants.htmlElements.groupChange.forEach((element) =>
    element.addEventListener("change", () =>
      handleCalculateValue(
        constants,
        variables,
        { sourceNote, destinationNote },
        setDefaultTextColor
      )
    )
  );

  // Reset all values
  const handleResetButton = (constants, setDefaultTextColor) => {
    const { definedTics, definedCommands, definedTooltipText, htmlElements } =
      constants;
    const {
      sourceNoteSelect,
      sourceOctaveSelect,
      sourceFinetuneSelect,
      destinationNoteSelect,
      destinationOctaveSelect,
      destinationFinetuneSelect,
      ticsButton,
      commandsButton,
      unitsResult,
    } = htmlElements;
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
    setDefaultTextColor(constants);
  };
  // Add handler for click on reset button
  constants.htmlElements.resetButton.addEventListener("click", () =>
    handleResetButton(constants, setDefaultTextColor)
  );
};

// Add handler for TonePortaStep
document.addEventListener("DOMContentLoaded", handleTonePortaStep, false);
