module.exports = {
    UserAvailablitySchema: {
        "id": "/userAvailablitySchema",
        "type": "object",
        "additionalProperties": false,
        "properties": {
            "emailId": {
                "type": "string",
                "format": "email"
            },
            "timeSlot": {
                "type": "object",
                "additionalProperties": false,
                "properties": {
                    "slotType": {
                        "type": "string",
                        "enum": ["week_day", "date"]
                    },
                    "weekDay": {
                        "type": "string",
                        "enum": ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"]
                    },
                    "date": {
                        "type": "string"
                    },
                    "interval": {
                        "type": "array",
                        "items": {
                            "type": "object",
                            "additionalProperties": false,
                            "properties": {
                                "from": {
                                    "type": "string",
                                    "format": "time"
                                },
                                "to": {
                                    "type": "string",
                                    "format": "time"
                                },
                                "required": ["from", "to"]
                            }
                        }
                    },
                    "required": ["slotType"]
                }
            }
        },
        "required": ["emailId", "timeSlot"]
    }
}