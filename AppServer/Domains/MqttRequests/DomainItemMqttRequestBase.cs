using System;
using System.Collections.Generic;
using System.Text;
using AppServer.Controllers.Dto.Requests.Interfaces;
using AppServer.Domains.MqttRequests.Interfaces;

namespace AppServer.Domains.MqttRequests
{
    /// <summary>
    /// 10 милли секунде минимальное время 
    /// Формируем запрос проверки
    /// _{int}_{int} - ключ запроса - должен быть отправлен обратно
    /// 
    /// DateTime_1_0 - проверка состояния
    /// 30 + 4 + 4 + 2 + 4 + 4+ 6 + 4 + 7 + 4
    /// DateTime_2_0*DIR={1-часовая/2-против}-WAY={нм} - смена позиции
    /// 
    /// DateTime_3_1*DIR={1-часовая/2-против}-WAY={нм}-STEP={нм}-COUNT={нм} - измерение тока на интервале
    /// 
    /// DateTime_3_2*DELAY={сек, время 1 измерения}-NUM={кол-во измерений за 1 DELAY} - измерение тока в точке от времени
    ///
    /// DateTime_4_1*DIR={1-часовая/2-против}-WAY={нм}-STEP={нм}-COUNT={нм} - измерение счетного режима на интервале
    /// 
    /// DateTime_4_2*DELAY={сек, время 1 измерения}-NUM={кол-во измерений за 1 DELAY} - измерение счетного режима в точке от времени
    /// </summary>
    public abstract class DomainItemMqttRequestBase<T> : IDomainItemMqttRequestBase
    {
        /// <summary>
        /// Тип: ток/счет/проверка состояния/смена позиции
        /// </summary>
        protected abstract ActionTypeEnum ActionType { get; }

        /// <summary>
        /// Подтип интервал/время на 1 точке
        /// </summary>
        protected abstract SubActionTypeEnum ActionSubType { get; }

        /// <summary>
        /// Тестовое сообщение для замыыкания бэка
        /// </summary>
        public virtual string TestCallBack()
        {
            return GetKey;
        }

        /// <inheritdoc />
        public (string key, string message) CreateRequest(string measureId = null)
        {
            var currentRequest = new StringBuilder(GetKey);
            var key = currentRequest.ToString();
            var values = GetMessageValue();
            if (!string.IsNullOrWhiteSpace(measureId))
            {
                values.Add(DomainValueConst.Id, measureId);
            }
           
            var firstItem = false;
            foreach (var value in values)
            {
                if (!firstItem)
                {
                    currentRequest.Append('*');
                    firstItem = true;
                }
                currentRequest.Append($"{value.Key}={value.Value}-");
            }

            var currentRequestString = currentRequest.ToString();
            if (currentRequestString.EndsWith('-'))
            {
                currentRequestString = currentRequestString.Remove(currentRequestString.Length - 1);
            }

            return (key, currentRequestString);
        }

        /// <summary>
        /// Парсинг сообщения с фронта
        /// </summary>
        public abstract void FromDtoApiRequest(T dto);

        /// <summary>
        /// Список кастомных полей для формирования запроса
        /// </summary>
        /// <returns></returns>
        protected abstract Dictionary<string, object> GetMessageValue();

        /// <summary>
        /// ключ запроса
        /// </summary>
        private string GetKey => $"_{(int)ActionType}_{(int)ActionSubType}";
    }
}