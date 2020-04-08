module.exports = {
    EventJsonSchema: {
        "id": "/eventSchema",
        "type": "object",
        "additionalProperties": false,
        "required": [
            "start",
            "end",
            "attendees"
        ],
        "properties": {
            "summary": {
                "title": "Summary",
                "type": "string",
                "default": "",
                "examples": [
                    "Taniya sen"
                ]
            },
            "description": {
                "title": "Description",
                "type": "string",
                "default": "",
                "examples": [
                    "A chance to hear more about Google's developer products."
                ]
            },
            "start": {
                "title": "Start",
                "type": "object",
                "required": [
                    "dateTime"
                ],
                "properties": {
                    "dateTime": {
                        "title": "Datetime",
                        "type": "string",
                        "default": "",
                        "examples": [
                            "2020-04-06T12:00:00.652Z"
                        ],
                        "format": "date-time"
                    },
                    "timeZone": {
                        "title": "Timezone",
                        "type": "string",
                        "default": "",
                        "examples": [
                            "Asia/Kolkata"
                        ]
                    }
                }
            }
            ,
            "end": {
                "title": "End",
                "type": "object",
                "required": [
                    "dateTime"
                ],
                "properties": {
                    "dateTime": {
                        "title": "Datetime",
                        "type": "string",
                        "default": "",
                        "examples": [
                            "2020-04-06T13:00:00.652Z"
                        ],
                        "format": "date-time"
                    },
                    "timeZone": {
                        "title": "Timezone",
                        "type": "string",
                        "default": "",
                        "examples": [
                            "Asia/Kolkata"
                        ]
                    }
                }
            },
            "attendees": {
                "title": "Attendees",
                "type": "object",
                "required": [
                    "email"
                ],
                "properties": {
                    "email": {
                        "title": "Email",
                        "type": "string",
                        "default": "",
                        "examples": [
                            "attendee@gmail.com"
                        ],
                        "format": "email"
                    },
                    "name": {
                        "type": "string"
                    }
                }
            }
        }
    }
}