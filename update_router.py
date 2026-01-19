import json

file_path = '/Users/alberto/src/nido/workflows/nido.router.telegram.json'

with open(file_path, 'r') as f:
    data = json.load(f)

# Find the Route Logic node
for node in data['nodes']:
    if node['name'] == 'Route Logic':
        # Update the jsCode
        current_code = node['parameters']['jsCode']
        
        # New code logic
        new_code = """const chatMap = {
    "Nido-Alberto": "5785514136",
    "Nido-Alberto-Laura": "-5223730192",
    "Nido-Alberto-Laura-Testing": "-5234536185",
    "Nido-Laura": "PLACEHOLDER"
};
const idToName = Object.fromEntries(Object.entries(chatMap).map(([k,v]) => [v, k]));

const item = $input.item.json;
const chatId = item.chat_id;
const chatName = idToName[String(chatId)] || 'Unknown';

let workflow_id = null;
const WORKFLOWS = {
    WHITEBOARD_INGEST: 't3IsM1h5-xaYeegf0PpyK',
    WHITEBOARD_REVIEW: 'gSnUtg5YnaLgjyYN2sKno',
    TELEGRAM_CALENDAR: 'rnr5kvlbBNvVA9wXvJGAE',
    SOCCER_EVENT: 'l-0lymHED94CrXwOsRH98',
    MEALS_INVENTORY: 'ApXo7C4Qijyz1gEK5D30F',
    MEALS_PLANNER: 'qFxG__hwtGSAfLK6Q83SR',
    MEALS_TRACKER: 'Mea1Track3rW0rkf10wID'
};

// Global Rule: Shopping -> nido.meals.inventory
if (item.category === 'SHOPPING') {
    workflow_id = WORKFLOWS.MEALS_INVENTORY;
}

// Global Rule: Meal Plan -> nido.meals.planner
if (item.category === 'MEAL_PLAN') {
    workflow_id = WORKFLOWS.MEALS_PLANNER;
}

// Global Rule: Meal Tracker -> nido.meals.tracker
if (item.category === 'MEAL_TRACKER' || item.category === 'meal_tracker') {
    workflow_id = WORKFLOWS.MEALS_TRACKER;
}

// Rule 1: Foto + Category: whiteboard_calendar + Chat: "Nido-Alberto" -> nido.whiteboard.ingest
if (chatName === 'Nido-Alberto') {
    if (item.image_type === 'whiteboard_calendar') {
        workflow_id = WORKFLOWS.WHITEBOARD_INGEST;
    }
    // Rule 2: Tipo: Callback + Chat: "Nido-Alberto" -> nido.whiteboard.review
    if (item.type === 'callback') {
        workflow_id = WORKFLOWS.WHITEBOARD_REVIEW;
    }
}

// Rule 3: Chat "Nido-Alberto-Laura-Testing" rules
if (chatName === 'Nido-Alberto-Laura-Testing') {
    // Texto + Category: calendar -> nido.telegram.calendar
    if (item.category === 'calendar') {
        workflow_id = WORKFLOWS.TELEGRAM_CALENDAR;
    }
    // Callback: cal_save or cal_cancel -> nido.telegram.calendar
    if (item.type === 'callback' && item.action && (item.action.startsWith('cal_'))) {
        workflow_id = WORKFLOWS.TELEGRAM_CALENDAR;
    }
}

// Global Rule: Calendar Callbacks (cal_*) always go to calendar workflow
if (item.type === 'callback' && item.action && String(item.action).startsWith('cal_')) {
    workflow_id = WORKFLOWS.TELEGRAM_CALENDAR;
}

// Global Rule: Soccer Callbacks (yes/no_football)
if (item.type === 'callback' && item.action && (String(item.action) === 'yes_football' || String(item.action) === 'no_football')) {
    workflow_id = WORKFLOWS.SOCCER_EVENT;
}

return { json: { workflow_id, ...item, chatName } };"""

        node['parameters']['jsCode'] = new_code

with open(file_path, 'w') as f:
    json.dump(data, f, indent=4)

print("Updated nido.router.telegram.json")
