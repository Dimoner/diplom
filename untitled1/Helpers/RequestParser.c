#include <string.h>
#include "RequestParser.h"

uint16_t str_to_uint16(const char *str) {
    char *end;
    long val = strtol(str, &end, 10);
    if (errno || end == str || *end != '\0' || val < 0 || val >= 0x10000) {
        return 0;
    }
    uint16_t res = (uint16_t)val;
    return res;
}

struct TypeStruct getTypeStruct(char* receiveBuf){
    char type[2];
    uint8_t typeDataIndex = 0;

    char subType[2];
    uint8_t payloadDataIndex = 0;

    bool border = false;
    for (int i = 0; i < strlen(receiveBuf); i++) {
        if (receiveBuf[i] == '*'){
            if(i != 5){
                subType[1] = '0';
            }
            break;
        }

        if (receiveBuf[i] == '_'){
            border = true;
            if(i != 2){
                type[1] = '0';
            }
            continue;
        }

        if (!border){
            type[typeDataIndex] = receiveBuf[i];
            typeDataIndex += 1;
        }

        if (border){
            subType[payloadDataIndex] = receiveBuf[i];
            payloadDataIndex += 1;
        }
    }

    struct TypeStruct tom = {"", ""};
    tom.type[0] = type[1];
    tom.type[1] = type[0];
    tom.subType[0] = subType[1];
    tom.subType[1] = subType[0];
    return tom;
}

char* getPayload(char requestPayload[]){
    char * token = strtok(requestPayload, "*");
    token = strtok(NULL, " ");
    return token;
}

/// DIR=1-WAY=111.1
struct ChangePositionStruct getChangePositionStruct(char requestPayload[]){
    struct ChangePositionStruct dima = { false, 0 };

    /// DIR=1 WAY=111.1
    char * param = strtok(requestPayload, "-=");
    while( param != NULL ) {

        if (strstr (param,"DIR") != NULL){
            param = strtok(NULL, "-=");
            dima.dir = strstr (param,"1") != NULL;
            param = strtok(NULL, "-=");
            continue;
        }

        if (strstr (param,"WAY") != NULL){
            param = strtok(NULL, "-=");
            float ftemp = atof(param);
            dima.way = ftemp;
            param = strtok(NULL, "-=");
            continue;
        }

        param = strtok(NULL, "-=");
    }


    return dima;
}

/// 3_1*DIR={1-часовая/2-против}-WAY={нм}-STEP={нм}-COUNT={нм}
struct DetectAmperageRangeStruct getDetectAmperageRangeStruct(char requestPayload[]){
    struct DetectAmperageRangeStruct dima = { false, 0,0,0 };

    /// DIR=1 WAY=111.1
    char * param = strtok(requestPayload, "-=");
    while( param != NULL ) {

        if (strstr (param,"DIR") != NULL){
            param = strtok(NULL, "-=");
            dima.dir = strstr (param,"1") != NULL;
            param = strtok(NULL, "-=");
            continue;
        }

        if (strstr (param,"WAY") != NULL){
            param = strtok(NULL, "-=");
            float ftemp = atof(param);
            dima.way = ftemp;
            param = strtok(NULL, "-=");
            continue;
        }

        if (strstr (param,"STEP") != NULL){
            param = strtok(NULL, "-=");
            float ftemp = atof(param);
            dima.step = ftemp;
            param = strtok(NULL, "-=");
            continue;
        }

        if (strstr (param,"COUNT") != NULL){
            param = strtok(NULL, "-=");
            float ftemp = str_to_uint16(param);
            dima.count = ftemp;
            param = strtok(NULL, "-=");
            continue;
        }

        param = strtok(NULL, "-=");
    }


    return dima;
}


