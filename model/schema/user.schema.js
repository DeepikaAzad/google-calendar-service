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
                "type": "array",
                "items" : { 
                    "type" : "object",
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
                            "type": "object",
                            "properties":{
                                "from" : {
                                    "type": "string",
                                    "format": "time"
                                },
                                "to": {
                                    "type": "string",
                                    "format": "time"
                                },
                                "required": ["from", "to"]
                            }
                        },
                        "startTime": {
                            "type": "string"
                        }
                    },
                    "required": ["slotType", "startTime"]
                }
            }
        },
        "required": ["emailId", "timeSlot"]
    }
}