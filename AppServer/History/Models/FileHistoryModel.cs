using System;
using AppServer.Domains;

namespace AppServer.History.Models
{
    /// <summary>
    /// Модель файла для истории
    /// </summary>
    public class FileHistoryModel
    {
        /// <summary>
        /// Идентификатор файла
        /// </summary>
        public int Id { get; set; }
        
        /// <summary>
        /// Название измерения
        /// </summary>
        public string MeasureName { get; set; }
        
        /// <summary>
        /// Тип измерения
        /// </summary>
        public string MeasureType { get; set; }
        
        /// <summary>
        /// Вермя создание файла
        /// </summary>
        public DateTime CreationDateTime { get; set; }
        
        /// <summary>
        /// Описание файла
        /// </summary>
        public string Description { get; set; }
        
        /// <summary>
        /// Способы измерения действия
        /// </summary>
        public SubActionTypeEnum SubType { get; set; }
        
        /// <summary>
        /// Типы действий
        /// </summary>
        public ActionTypeEnum TypeAction { get; set; }
    }
}