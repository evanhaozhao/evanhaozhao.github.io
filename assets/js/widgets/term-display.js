
const terms = [
    {
    name: "Induction Week",
    start: moment("2022-09-26"),
    end: moment("2022-10-02")
    },
    {
    name: "Michaelmas Term",
    start: moment("2022-10-03"),
    end: moment("2022-12-09")
    },
    {
    name: "Christmas vacation",
    start: moment("2022-12-10"),
    end: moment("2023-01-08")
    },
    {
    name: "Epiphany Term",
    start: moment("2023-01-09"),
    end: moment("2023-03-17")
    },
    {
    name: "Easter vacation",
    start: moment("2023-03-18"),
    end: moment("2023-04-23")
    },
    {
    name: "Easter Term",
    start: moment("2023-04-24"),
    end: moment("2023-06-23")
    },
    {
    name: "Summer vacation",
    start: moment("2023-06-24"),
    end: moment("2023-09-24")
    },
    {
    name: "Summer vacation",
    start: moment("2023-06-24"),
    end: moment("2023-09-24")
    },
    {
    name: "Induction Week",
    start: moment("2023-09-25"),
    end: moment("2023-10-01")
    },
    {
    name: "Michaelmas Term",
    start: moment("2023-10-02"),
    end: moment("2023-12-08")
    },
    {
    name: "Christmas vacation",
    start: moment("2023-12-09"),
    end: moment("2024-01-07")
    },
    {
    name: "Epiphany Term",
    start: moment("2024-01-08"),
    end: moment("2024-03-15")
    },
    {
    name: "Easter vacation",
    start: moment("2024-03-16"),
    end: moment("2024-04-21")
    },
    {
    name: "Easter Term",
    start: moment("2024-04-22"),
    end: moment("2024-06-21")
    },
    {
    name: "Summer vacation",
    start: moment("2024-06-22"),
    end: moment("2024-09-29")
    },
    {
    name: "Summer vacation",
    start: moment("2024-06-22"),
    end: moment("2024-09-29")
    },
    {
    name: "Induction Week",
    start: moment("2024-09-30"),
    end: moment("2024-10-06")
    },
    {
    name: "Michaelmas Term",
    start: moment("2024-10-07"),
    end: moment("2024-12-13")
    },
    {
    name: "Christmas vacation",
    start: moment("2024-12-14"),
    end: moment("2025-01-12")
    },
    {
    name: "Epiphany Term",
    start: moment("2025-01-13"),
    end: moment("2025-03-21")
    },
    {
    name: "Easter vacation",
    start: moment("2025-03-22"),
    end: moment("2025-04-27")
    },
    {
    name: "Easter Term",
    start: moment("2025-04-28"),
    end: moment("2025-06-27")
    },
    {
    name: "Summer vacation",
    start: moment("2025-06-28"),
    end: moment("2025-09-28")
    },
    {
    name: "Summer vacation",
    start: moment("2025-06-28"),
    end: moment("2025-09-28")
    },
    {
    name: "Induction Week",
    start: moment("2025-09-29"),
    end: moment("2025-10-05")
    },
    {
    name: "Michaelmas Term",
    start: moment("2025-10-06"),
    end: moment("2025-12-12")
    },
    {
    name: "Christmas vacation",
    start: moment("2025-12-13"),
    end: moment("2026-01-11")
    },
    {
    name: "Epiphany Term",
    start: moment("2026-01-12"),
    end: moment("2026-03-20")
    },
    {
    name: "Easter vacation",
    start: moment("2026-03-21"),
    end: moment("2026-04-26")
    },
    {
    name: "Easter Term",
    start: moment("2026-04-27"),
    end: moment("2026-06-26")
    },
    {
    name: "Summer vacation",
    start: moment("2026-06-27"),
    end: moment("2026-09-27")
    },
    {
    name: "Summer vacation",
    start: moment("2026-06-27"),
    end: moment("2026-09-27")
    }
];

const currentTerm = terms.find(term => {
    const now = moment().tz('Europe/London').startOf('day');
    term.remainingDays = term.end.diff(now, 'days');
    const weeks = Math.ceil(now.diff(term.start, 'days') / 7);
    term.currentWeek = weeks > 0 ? weeks : 1; 
    return now.isBetween(term.start, term.end, 'day', '[]'); 
});

if (!currentTerm) {
    document.getElementById("current-term").textContent = "None";
    document.getElementById("next-term").textContent = "None";
}
else{
    if (currentTerm.remainingDays === 0) {
        const termString = currentTerm.name.includes("Term") ? currentTerm.name + " (week " + currentTerm.currentWeek + "), ends today" : currentTerm.name + ", ends today";
        document.getElementById("current-term").textContent = termString;
    } else {
        const termString = currentTerm.name.includes("Term") ? currentTerm.name + " (week " + currentTerm.currentWeek + "), " + currentTerm.remainingDays + " day" + (currentTerm.remainingDays === 1 ? " remains" : "s remain") : currentTerm.name + ", " + currentTerm.remainingDays + " day" + (currentTerm.remainingDays === 1 ? " remains" : "s remain");
        document.getElementById("current-term").textContent = termString;
    }

    const nextTerm = terms.find(term => term.start.isAfter(currentTerm.end));
    if (!nextTerm) {
        document.getElementById("next-term").textContent = "None";
    }
    else {
        document.getElementById("next-term").textContent = nextTerm.name + " (" + nextTerm.start.year() + ")";
    }
}