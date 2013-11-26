/*
 * Copyright (c) 2013 - General Electric - Confidential - All Rights Reserved
 * 
 * Author: Christopher Baker <christopher.baker2@ge.com>
 *  
 */

const REFRIGERATOR_BASE = 0x1000;
const ADDRESS_DOOR_BOARD = 0x03;
const COMMAND_REQUEST_DOOR_STATE = 0x23;
const COMMAND_REQUEST_ALL_DOOR_BOARD_INFO = 0x36;

function Refrigerator (bus, appliance, base) {
    appliance.filterAlert = appliance.erd({
        erd: base++,
        format: "UInt8"
    });

    appliance.filterExpirationStatus = appliance.erd({
        erd: base++,
        endian: "big",
        format: [
            "waterFilterCalendarTimer:UInt16",
            "waterFilterCalendarPercentUsed:UInt8",
            "waterFilterHoursRemaining:UInt16",
            "waterUsageTimer:UInt32",
            "waterFilterUsageTimePercentUsed:UInt8",
            "waterFilterOuncesRemaining:UInt32"
        ]
    });
    
    appliance.commandFeatures = appliance.erd({
        erd: base++,
        format: "UInt8"
    });
    
    appliance.temperatureAlert = appliance.erd({
        erd: base++,
        format: "UInt8"
    });
    
    appliance.displayTemperature = appliance.erd({
        erd: base++,
        format: [
            "freshFoodTemperature:UInt8",
            "freezerTemperature:UInt8"
        ]
    });
    
    appliance.setpointTemperature = appliance.erd({
        erd: base++,
        format: [
            "freshFoodTemperature:UInt8",
            "freezerTemperature:UInt8"
        ]
    });
    
    appliance.doorAlarmAlert = appliance.erd({
        erd: base++,
        format: "UInt8"
    });
    
    appliance.iceMakerBucketStatus = appliance.erd({
        erd: base++,
        format: "UInt8"
    });
    
    appliance.odorFilterExpirationStatus = appliance.erd({
        erd: base++,
        endian: "big",
        format: [
            "odorFilterCalendarTimer:UInt16",
            "odorFilterPercentUsed:UInt8",
            "odorFilterHoursRemaining:UInt16"
        ]
    });
    
    appliance.doorState = appliance.command({
        command: COMMAND_REQUEST_DOOR_STATE,
        format: [
            "doorState:UInt8",
            "dcSwitchState:UInt8",
            "acInputState:UInt8"
        ]
    });
    
    appliance.doorBoard = bus.endpoint(ADDRESS_DOOR_BOARD);
    
    appliance.doorBoard.information = appliance.doorBoard.command({
        command: COMMAND_REQUEST_ALL_DOOR_BOARD_INFO,
        endian: "big",
        format: [
            "iceMakerMoldThermistorTemperature:UInt16",
            "iceCabinetThermistorTemperature:UInt16",
            "hotWaterThermistor1Temperature:UInt16",
            "hotWaterThermistor2Temperature:UInt16",
            "dctSwitchState:UInt8",
            "relayStatus:UInt8",
            "ductDoorStatus:UInt8",
            "iceMakerStateSelection:UInt8",
            "iceMakerOperationalState:UInt8"
        ]
    });
    
    return appliance;
}

exports.plugin = function (bus, configuration, callback) {
    bus.on("appliance", function (appliance) {
        appliance.read(REFRIGERATOR_BASE, function (value) {
            bus.emit("refrigerator", 
                Refrigerator(bus, appliance, REFRIGERATOR_BASE));
        });
    });
    
    callback(bus);
};

