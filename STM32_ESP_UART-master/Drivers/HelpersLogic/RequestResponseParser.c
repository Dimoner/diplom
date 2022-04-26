#include "RequestResponseParser.h"

// char[] -> uint16_t
uint16_t str_to_uint16(const char *str) {
    char *end;
    long val = strtol(str, &end, 10);
    return (uint16_t)val;
}

// char[] -> uint8_t
uint32_t str_to_uint32(const char *str) {
    char *end;
    long val = strtol(str, &end, 10);
    return (uint32_t)val;
}

// char[] -> float
float stof(const char* s){
    float rez = 0, fact = 1;
    if (*s == '-'){
        s++;
        fact = -1;
    };
    for (int point_seen = 0; *s; s++){
        if (*s == '.'){
            point_seen = 1;
            continue;
        };
        int d = *s - '0';
        if (d >= 0 && d <= 9){
            if (point_seen) fact /= 10.0f;
            rez = rez * 10.0f + (float)d;
        };
    };
    return rez * fact;
};

// зануление всех элементов char[]
void clean(char *var) {
	uint32_t i = 0;
    while(var[i] != '\0') {
        var[i] = '\0';
        i++;
    }
}

struct TypeStruct getTypeStruct(char receiveBuf[200]){
    char type[2];
    uint8_t typeDataIndex = 0;

    char subType[2];
    uint8_t payloadDataIndex = 0;

    bool border = false;
    // _0_0*
    // пропускаем первую _, поэтому начинаем с int i = 1,
    for (int i = 1; i < strlen(receiveBuf); i++) {
        if (receiveBuf[i] == '*'){
            break;
        }

        if (receiveBuf[i] == '_'){
            border = true;
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
    tom.type[0] = type[0];
    tom.type[1] = type[1];
    tom.subType[0] = subType[0];
    tom.subType[1] = subType[1];
    return tom;
}

char* getPayload(char requestPayload[]){
    char * token = strtok(requestPayload, "*");
    token = strtok(NULL, " ");
    return token;
}

/// DIR=1-WAY=111.1-ID={int}
struct ChangePositionStruct getChangePositionStruct(char requestPayload[]){
    struct ChangePositionStruct dima = { false, 0 };

    /// DIR=1 WAY=111.1
    char * param = strtok(requestPayload, "-=");
    while( param != NULL ) {

        if (strstr (param,"ID") != NULL){
            param = strtok(NULL, "-=");
            dima.id = str_to_uint16(param);
            param = strtok(NULL, "-=");
            continue;
        }

        if (strstr (param,"DIR") != NULL){
            param = strtok(NULL, "-=");
            dima.dir = strstr (param,"1") != NULL;
            param = strtok(NULL, "-=");
            continue;
        }

        if (strstr (param,"WAY") != NULL){
            param = strtok(NULL, "-=");
            dima.way = str_to_uint32(param);
            param = strtok(NULL, "-=");
            continue;
        }

        param = strtok(NULL, "-=");
    }


    return dima;
}

/// 3_1*DIR={1-часовая/2-против}-WAY={нм}-STEP={нм}-COUNT={нм}-ID={int}-CUR={float}-SPE=2
struct DetectAmperageRangeStruct getDetectAmperageRangeStruct(char requestPayload[]){
    struct DetectAmperageRangeStruct dima = { false, 0,0,0 };

    /// DIR=1 WAY=111.1
    char * param = strtok(requestPayload, "-=");
    while( param != NULL ) {

        if (strstr (param,"ID") != NULL){
            param = strtok(NULL, "-=");
            dima.id = str_to_uint16(param);
            param = strtok(NULL, "-=");
            continue;
        }

        if (strstr (param,"DIR") != NULL){
            param = strtok(NULL, "-=");
            dima.dir = strstr (param,"1") != NULL;
            param = strtok(NULL, "-=");
            continue;
        }

        if (strstr (param,"WAY") != NULL){
            param = strtok(NULL, "-=");
            dima.way = str_to_uint32(param);
            param = strtok(NULL, "-=");
            continue;
        }

        if (strstr (param,"STEP") != NULL){
            param = strtok(NULL, "-=");
            dima.step = str_to_uint32(param);
            param = strtok(NULL, "-=");
            continue;
        }

        if (strstr (param,"CUR") != NULL){
            param = strtok(NULL, "-=");
            float ftemp = str_to_uint16(param);
            dima.cur = ftemp;
            param = strtok(NULL, "-=");
            continue;
         }

        if (strstr (param,"COUNT") != NULL){
            param = strtok(NULL, "-=");
            dima.count = str_to_uint16(param);
            param = strtok(NULL, "-=");
            continue;
        }

        if (strstr (param,"SPE") != NULL){
            param = strtok(NULL, "-=");
            dima.speed = str_to_uint32(param);
            param = strtok(NULL, "-=");
            continue;
        }

        param = strtok(NULL, "-=");
    }


    return dima;
}

/// _03_02*DELAY=10000-NUM=1-FREQ=1000-ID=1
struct DetectAmperageTimeStruct getDetectAmperageTimeStruct(char requestPayload[]){
    struct DetectAmperageTimeStruct dima = { 0, 0, 0, 0 };

    char * param = strtok(requestPayload, "-=");
    while( param != NULL ) {
        if (strstr (param,"ID") != NULL){
            param = strtok(NULL, "-=");
            dima.id = str_to_uint16(param);
            param = strtok(NULL, "-=");
            continue;
        }

        if (strstr (param, "POINT") != NULL){
            param = strtok(NULL, "-=");
            dima.pointCount = str_to_uint32(param);
            param = strtok(NULL, "-=");
            continue;
        }

        if (strstr (param,"FREQ") != NULL){
            param = strtok(NULL, "-=");
            float ftemp = stof(param);
            dima.freq = str_to_uint32(param);
            param = strtok(NULL, "-=");
            continue;
        }

        if (strstr (param,"COUNT") != NULL){
            param = strtok(NULL, "-=");
            dima.count = str_to_uint16(param);
            param = strtok(NULL, "-=");
            continue;
        }

        param = strtok(NULL, "-=");
    }


    return dima;
}





