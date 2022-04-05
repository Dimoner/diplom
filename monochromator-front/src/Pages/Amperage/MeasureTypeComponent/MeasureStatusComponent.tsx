import React from "react";
import { IOldMeasureState, MeasureStatusEnum } from "../Interfaces/AmperagePageInterfaces";
import { HttpServiceHelper } from "../../../Helpers/HttpServiceHelper";

export interface IMeasureStatusComponent{
    measureAdditionInfo: IOldMeasureState
}
export default function MeasureStatusComponent({measureAdditionInfo}: IMeasureStatusComponent) {
    const renderStatus = () => {
        switch (measureAdditionInfo.status) {
            case MeasureStatusEnum.None:
                return (
                    <div className={"is-unknown-measure"}>
                        Неизвестно
                    </div>
                );
            case MeasureStatusEnum.Measuring:
                return (
                    <div className={"process-measure"}>
                        В процессе
                    </div>
                );
            case MeasureStatusEnum.End:
                return (
                    <>
                        <div className={"complete-measure"}>
                            Завершено
                        </div>
                        {measureAdditionInfo.measureId !== 0 ?
                            <svg
                                style={{ marginTop: "-6px", cursor: "pointer", marginLeft: "5px" }}
                                onClick={() => {
                                    HttpServiceHelper.downloadAsFile(measureAdditionInfo.measureId, measureAdditionInfo.measureName || measureAdditionInfo.measureDate)
                                }}
                                xmlns="http://www.w3.org/2000/svg"
                                enable-background="new 0 0 24 24"
                                height="36px"
                                viewBox="0 0 24 24"
                                width="36px"
                                fill="#000000"
                            >
                                <g>
                                    <rect fill="none" height="24" width="24"/>
                                </g>
                                <g>
                                    <path
                                        d="M18,15v3H6v-3H4v3c0,1.1,0.9,2,2,2h12c1.1,0,2-0.9,2-2v-3H18z M17,11l-1.41-1.41L13,12.17V4h-2v8.17L8.41,9.59L7,11l5,5 L17,11z"/>
                                </g>
                            </svg> : ""}
                    </>
                );
            default:
                return ""
        }
    }

    return (
        <div className="amperage-loader-information-data">
            <div className="data-info">
                <div className="data-info-block">
                    <div className="data-info-block-title">
                        Статус:
                    </div>
                    <div className="data-info-block-title">
                        Название:
                    </div>
                    <div className="data-info-block-title">
                        Дата:
                    </div>
                </div>

                <div className="data-info-block data-info-block-text">
                    <div className="data-info-block-content data-info-block-text-content">
                        {renderStatus()}

                    </div>

                    <div className="data-info-block-content data-info-block-text-content">
                        {measureAdditionInfo?.measureName || "-"}
                    </div>

                    <div className="data-info-block-content data-info-block-text-content">
                        {measureAdditionInfo?.measureDate || "-"}
                    </div>
                </div>
            </div>
        </div>
    )
}