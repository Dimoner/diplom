#include "../Domains/TypeStruct.h"

bool isCheckState(struct TypeStruct dto){
    return dto.type[0] == '0' && dto.type[1] == '1' && dto.subType[0] == '0' && dto.subType[1] == '0';
}

bool isChangePosition(struct TypeStruct dto){
    return dto.type[0] == '0' && dto.type[1] == '2' && dto.subType[0] == '0' && dto.subType[1] == '0';
}

bool isDetectAmperageRange(struct TypeStruct dto){
    return dto.type[0] == '0' && dto.type[1] == '3' && dto.subType[0] == '0' && dto.subType[1] == '1';
}

bool isDetectAmperageTime(struct TypeStruct dto){
    return dto.type[0] == '0' && dto.type[1] == '3' && dto.subType[0] == '0' && dto.subType[1] == '2';
}

bool isDetectTickRange(struct TypeStruct dto){
    return dto.type[0] == '0' && dto.type[1] == '4' && dto.subType[0] == '0' && dto.subType[1] == '1';
}

bool isDetectTickTime(struct TypeStruct dto){
    return dto.type[0] == '0' && dto.type[1] == '4' && dto.subType[0] == '0' && dto.subType[1] == '2';
}

bool isContinueMeasure(struct TypeStruct dto){
    return dto.type[0] == '0' && dto.type[1] == '5' && dto.subType[0] == '0' && dto.subType[1] == '0';
}

bool isPauseMeasure(struct TypeStruct dto){
    return dto.type[0] == '0' && dto.type[1] == '6' && dto.subType[0] == '0' && dto.subType[1] == '0';
}

bool isStopMeasure(struct TypeStruct dto){
    return dto.type[0] == '0' && dto.type[1] == '7' && dto.subType[0] == '0' && dto.subType[1] == '0';
}