const handleTonePortaStep = () => {
  const constants = {
    definedTics: "6",
    definedCommands: "1",
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
      ticsInput: document.querySelector("#ticsInput"),
      commandsInput: document.querySelector("#commandsInput"),
      unitsResult: document.querySelector("#unitsResult"),
      resetButton: document.querySelector("#resetButton"),
      groupChange: document.querySelectorAll(".groupChange"),
    },
    // Key codes for note periods C  C#  D  D#  E  F  F#  G  G#  A  A#  B and three octaves
    shortkeyTable: [
      99, 67, 100, 68, 101, 102, 70, 103, 71, 97, 65, 98, 49, 50, 51,
    ],
    // Index for note periods C  C# D  D# E  F  F# G  G# A  A#  B and three octaves
    shortkeyIndexTable: [
      "0",
      "1",
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
      "10",
      "11",
      "0",
      "1",
      "2",
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
    handleSwitchDestinationToSourceFinetuneCallback: null,
    handleSwitchSourceToDestinationFinetuneCallback: null,
    handleGetSourceNoteByPressedKeyCallback: null,
    handleSetSourceNoteCallback: null,
    handleMouseLeaveSourceNoteCallback: null,
    handleGetDestinationNoteByPressedKeyCallback: null,
    handleSetDestinationNoteCallback: null,
    handleMouseLeaveDestinationNoteCallback: null,
    handleCalculatePortamentoCallback: null,
  };

  const setDefaultTextColor = ({ htmlElements }) => {
    const { unitsResult } = htmlElements;
    if (unitsResult.classList.contains("text-danger")) {
      unitsResult.classList.remove("text-danger");
      unitsResult.classList.add("textColored");
    }
  };

  const handleSwitchDestinationToSourceFinetune = ({ htmlElements }) => {
    const { sourceFinetuneSelect, destinationFinetuneSelect } = htmlElements;
    destinationFinetuneSelect.value = sourceFinetuneSelect.value;
  };

  const addSwitchDestinationToSourceFinetuneHandler = (
    handleSwitchDestinationToSourceFinetune,
    { constants, variables }
  ) => {
    variables.handleSwitchDestinationToSourceFinetuneCallback = () => {
      handleSwitchDestinationToSourceFinetune(constants);
    };

    constants.htmlElements.sourceFinetuneSelect.addEventListener(
      "click",
      variables.handleSwitchDestinationToSourceFinetuneCallback
    );
  };

  addSwitchDestinationToSourceFinetuneHandler(
    handleSwitchDestinationToSourceFinetune,
    { constants, variables }
  );

  const handleSwitchSourceToDestinationFinetune = ({ htmlElements }) => {
    const { sourceFinetuneSelect, destinationFinetuneSelect } = htmlElements;
    sourceFinetuneSelect.value = destinationFinetuneSelect.value;
  };

  const addSwitchSourceToDestinationFinetuneHandler = (
    handleSwitchSourceToDestinationFinetune,
    { constants, variables }
  ) => {
    variables.handleSwitchSourceToDestinationFinetuneCallback = () => {
      handleSwitchSourceToDestinationFinetune(constants);
    };

    constants.htmlElements.destinationFinetuneSelect.addEventListener(
      "click",
      variables.handleSwitchSourceToDestinationFinetuneCallback
    );
  };
  addSwitchSourceToDestinationFinetuneHandler(
    handleSwitchSourceToDestinationFinetune,
    { constants, variables }
  );

  const handleSetSourceNote = (
    { constants, variables },
    { sourceNote, destinationNote }
  ) => {
    const handleGetSourceNoteByPressedKey = (
      { which, keyCode },
      { constants, variables },
      { sourceNote, destinationNote }
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
      handleCalculatePortamento(
        { constants, variables },
        { sourceNote, destinationNote }
      );
    };

    const addGetSourceNoteByPressedKeyHandler = (
      handleGetSourceNoteByPressedKey,
      { constants, variables }
    ) => {
      variables.handleGetSourceNoteByPressedKeyCallback = (event) =>
        handleGetSourceNoteByPressedKey(
          event,
          { constants, variables },
          {
            sourceNote,
            destinationNote,
          }
        );

      sourceNoteContainer.addEventListener(
        "keypress",
        variables.handleGetSourceNoteByPressedKeyCallback
      );
    };

    const { sourceNoteContainer } = constants.htmlElements;
    sourceNoteContainer.focus();
    addGetSourceNoteByPressedKeyHandler(handleGetSourceNoteByPressedKey, {
      constants,
      variables,
    });
  };

  const addSetSourceNoteHandler = (
    handleSetSourceNote,
    { constants, variables }
  ) => {
    variables.handleSetSourceNoteCallback = () => {
      handleSetSourceNote(
        { constants, variables },
        { sourceNote, destinationNote }
      );
    };

    constants.htmlElements.sourceNoteContainer.addEventListener(
      "mouseenter",
      variables.handleSetSourceNoteCallback
    );
  };

  addSetSourceNoteHandler(handleSetSourceNote, { constants, variables });

  const handleMouseLeaveSourceNote = ({ constants, variables }) => {
    const { sourceNoteContainer } = constants.htmlElements;
    sourceNoteContainer.blur();
    sourceNoteContainer.removeEventListener(
      "keypress",
      variables.handleGetSourceNoteByPressedKeyCallback
    );
  };

  const addMouseLeaveSourceNoteHandler = (
    handleMouseLeaveSourceNote,
    { constants, variables }
  ) => {
    variables.handleMouseLeaveSourceNoteCallback = () => {
      handleMouseLeaveSourceNote({ constants, variables });
    };

    constants.htmlElements.sourceNoteContainer.addEventListener(
      "mouseleave",
      variables.handleMouseLeaveSourceNoteCallback
    );
  };

  addMouseLeaveSourceNoteHandler(handleMouseLeaveSourceNote, {
    constants,
    variables,
  });

  const handleSetDestinationNote = (
    { constants, variables },
    { sourceNote, destinationNote }
  ) => {
    const handleGetDestinationNoteByPressedKey = (
      { which, keyCode },
      { constants, variables },
      { sourceNote, destinationNote }
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
      handleCalculatePortamento(
        { constants, variables },
        { sourceNote, destinationNote }
      );
    };

    const addGetDestinationNoteByPressedKeyHandler = (
      handleGetDestinationNoteByPressedKey,
      { constants, variables }
    ) => {
      variables.handleGetDestinationNoteByPressedKeyCallback = (event) => {
        handleGetDestinationNoteByPressedKey(
          event,
          { constants, variables },
          { sourceNote, destinationNote }
        );
      };

      destinationNoteContainer.addEventListener(
        "keypress",
        variables.handleGetDestinationNoteByPressedKeyCallback
      );
    };

    const { destinationNoteContainer } = constants.htmlElements;
    destinationNoteContainer.focus();
    addGetDestinationNoteByPressedKeyHandler(
      handleGetDestinationNoteByPressedKey,
      { constants, variables }
    );
  };

  const addSetDestinationNoteHandler = (
    handleSetDestinationNote,
    { constants, variables }
  ) => {
    variables.handleSetDestinationNoteCallback = () => {
      handleSetDestinationNote(
        { constants, variables },
        { sourceNote, destinationNote }
      );
    };

    constants.htmlElements.destinationNoteContainer.addEventListener(
      "mouseenter",
      variables.handleSetDestinationNoteCallback
    );
  };

  addSetDestinationNoteHandler(handleSetDestinationNote, {
    constants,
    variables,
  });

  const handleMouseLeaveDestinationNote = ({ constants, variables }) => {
    const { destinationNoteContainer } = constants.htmlElements;
    destinationNoteContainer.blur();
    destinationNoteContainer.removeEventListener(
      "keypress",
      variables.handleGetDestinationNoteByPressedKey
    );
  };

  const addMouseLeaveDestinationNoteHandler = (
    handleMouseLeaveDestinationNote,
    { constants, variables }
  ) => {
    variables.handleMouseLeaveDestinationNoteCallback = () => {
      handleMouseLeaveDestinationNote({ constants, variables });
    };

    constants.htmlElements.destinationNoteContainer.addEventListener(
      "mouseleave",
      variables.handleMouseLeaveDestinationNoteCallback
    );
  };

  addMouseLeaveDestinationNoteHandler(handleMouseLeaveDestinationNote, {
    constants,
    variables,
  });

  const handleCalculatePortamento = (
    { constants, variables },
    { sourceNote, destinationNote }
  ) => {
    const convertInputElementsValues = (
      { constants, variables },
      { sourceNote, destinationNote }
    ) => {
      const {
        sourceNoteSelect,
        sourceOctaveSelect,
        sourceFinetuneSelect,
        destinationNoteSelect,
        destinationOctaveSelect,
        destinationFinetuneSelect,
        ticsInput,
        commandsInput,
      } = constants.htmlElements;
      sourceNote.periodIndex = parseInt(sourceNoteSelect.value);
      sourceNote.octaveIndex = parseInt(sourceOctaveSelect.value);
      sourceNote.finetuneIndex = parseInt(sourceFinetuneSelect.value);
      destinationNote.periodIndex = parseInt(destinationNoteSelect.value);
      destinationNote.octaveIndex = parseInt(destinationOctaveSelect.value);
      destinationNote.finetuneIndex = parseInt(destinationFinetuneSelect.value);
      variables.tics = parseInt(ticsInput.value);
      variables.tics--; // Without first tick
      variables.commands = parseInt(commandsInput.value);
    };

    const getPeriodValuesFromTable = (
      { semiTones, semiToneOctaves, periodsTable },
      { sourceNote, destinationNote }
    ) => {
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

    const calculateUnitsPerCommand = (
      variables,
      { sourceNote, destinationNote }
    ) => {
      const { tics, commands } = variables;
      variables.periodDiff = Math.abs(
        destinationNote.period - sourceNote.period
      );
      variables.ticsPeriodDiff = Math.ceil(variables.periodDiff / tics);
      variables.commandsPeriodDiff = Math.ceil(
        variables.ticsPeriodDiff / commands
      );
    };

    const outputUnitsPerCommand = ({ constants, variables }) => {
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

    convertInputElementsValues(
      { constants, variables },
      { sourceNote, destinationNote }
    );
    getPeriodValuesFromTable(constants, { sourceNote, destinationNote });
    calculateUnitsPerCommand(variables, { sourceNote, destinationNote });
    outputUnitsPerCommand({ constants, variables });
  };

  const addCalculatePortamentoHandler = (
    handleCalculatePortamento,
    { constants, variables }
  ) => {
    constants.htmlElements.groupChange.forEach((element) => {
      variables.handleCalculatePortamentoCallback = () => {
        handleCalculatePortamento(
          { constants, variables },
          { sourceNote, destinationNote }
        );
      };

      element.addEventListener(
        "change",
        variables.handleCalculatePortamentoCallback
      );
    });
  };

  addCalculatePortamentoHandler(handleCalculatePortamento, {
    constants,
    variables,
  });

  const handleResetButton = (constants) => {
    const { definedTics, definedCommands, definedTooltipText, htmlElements } =
      constants;
    const {
      sourceNoteSelect,
      sourceOctaveSelect,
      sourceFinetuneSelect,
      destinationNoteSelect,
      destinationOctaveSelect,
      destinationFinetuneSelect,
      ticsInput,
      commandsInput,
      unitsResult,
    } = htmlElements;
    sourceNoteSelect.value = "0";
    sourceOctaveSelect.value = "0";
    sourceFinetuneSelect.value = "0";
    destinationNoteSelect.value = "0";
    destinationOctaveSelect.value = "0";
    destinationFinetuneSelect.value = "0";
    ticsInput.value = definedTics;
    commandsInput.value = definedCommands;
    unitsResult.innerHTML = "00";
    unitsResult.title = definedTooltipText;
    setDefaultTextColor(constants);
  };

  const addResetButtonHandler = (handleResetButton, constants) => {
    const handleResetButtonCallback = () => {
      handleResetButton(constants);
    };

    constants.htmlElements.resetButton.addEventListener(
      "click",
      handleResetButtonCallback
    );
  };

  addResetButtonHandler(handleResetButton, constants);
};

const addTonePortaStepHandler = (handleTonePortaStep) => {
  document.addEventListener("DOMContentLoaded", handleTonePortaStep, false);
};

addTonePortaStepHandler(handleTonePortaStep);
