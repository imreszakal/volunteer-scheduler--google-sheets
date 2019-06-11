# Volunteer workshift scheduler on Google Sheets
Written in Google Apps Script, this is the Fully automated Google Sheets version of the original volunteer-scheduler software developed in Python.

Based on the data sheet, it finds the best possible schedule for volunteers while incorporating constrains and special 
requirements using the linear optimization service.

### The problem
Arranging volunteers for a helpline service for the period of one month.

There are three types of work that could be done on the same day:
- Phone shift: Every day.
- Chat shift: Mondays and Wednesdays.
- Observer shift: Any day.

### Constraints:
Properties of each volunteer:
- Available days.
- Function: doing phone, chat, both or observation for training purposes.
- Maximum amount of weekend shifts.
- Whether their shifts have to be on separate weeks.
- Whether they welcome observers.
- Whether they want to work alone.
- Whether they cannot yet work alone.
- List of people they do not want to work with.

Each volunteer has to have 4 days between their shifts.

### Priorities:
1. Have minimum one volunteer for each day.
2. Fill chat shifts.
3. Have a second volunteer even on phone days.
4. Employ observers on days when there is only phone shift.

### Objective:
 Maximize filled shifts.

<hr>

## Installation

1. Import "Scheduler.xlsx" or "Scheduler.ods" into Google Sheets.
2. In the menu, click on "Tools"/"Script editor".
3. Copy the code from "Code.gs" into the "Code.gs" editor and save it.
4. In the "Data" worksheet, right-click on the image, select "Assign script...", type "myScheduler" and click "OK".

## Usage
1. Fill in your data on the "Data" worksheet.
2. Click on the image.

## Output

1. A new worksheet is created from the "Template" worksheet with the computed results.
