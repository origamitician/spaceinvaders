var listOfWaves = [
    [
        //sector 1
        {command: "120F3-45L2-35R3-120F3-180L1.5-50F3-20R7-50F3-45L2-200F3" /**/,
        length: 6,
        pattern: "1",
        coords: "0,300",
        double: false,
        escapeProb: 0,
        waveID: 0,
        next: [1]},

        {command: "120F3-120L0.5-50R3-50F3-3R40-120F3-60L1-100F3",
        length: 8,
        pattern: "12",
        coords: "0,300",
        double: false,
        escapeProb: 0,
        waveID: 1,
        next: [2]},

        {command: "1R30-100F3-30L1-200F3-120L2-40F3-45R1.5-300F3",
        length: 5,
        pattern: "2",
        coords: "0,0",
        double: true,
        escapeProb: 0,
        waveID: 2,
        next: [3, 4]},

        {command: "1R135-70F3-45R1-200F3-360R2-40F3-70L2.75-300F3",
        length: 11,
        pattern: "123",
        coords: "1280,0",
        double: false,
        escapeProb: 0,
        waveID: 3},

        {command: "200F3-45L2-15F3-45L2-40F3-90L2-300F3",
        length: 7,
        pattern: "122",
        coords: "0,250",
        double: true,
        escapeProb: 0,
        waveID: 4}, 

        
    ],
]