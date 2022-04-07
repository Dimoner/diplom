using System.Collections.Generic;
using System.Text;
using AppServer.Domains.MqttRequests.Interfaces;

namespace AppServer.Domains.MqttRequests
{
    /// <summary>
    /// 10 милли секунде минимальное время 
    /// Формируем запрос проверки
    /// _{int}_{int} - ключ запроса - должен быть отправлен обратно
    /// 
    /// _1_0* - проверка состояния
    /// 
    /// _2_0*DIR={1-часовая/2-против}-WAY={нм} - смена позиции
    /// 
    /// _3_1*DIR={1-часовая/2-против}-WAY={нм}-STEP={нм}-COUNT={нм} - измерение тока на интервале
    /// 
    /// _3_2*DELAY={сек, время 1 измерения}-NUM={кол-во измерений за 1 DELAY}-FREQ={Частота измерения в сек} - измерение тока в точке от времени
    ///
    /// _4_1*DIR={1-часовая/2-против}-WAY={нм}-STEP={нм}-COUNT={нм} - измерение счетного режима на интервале
    /// 
    /// _4_2*DELAY={сек, время 1 измерения}-NUM={кол-во измерений за 1 DELAY}-FREQ={Частота измерения в сек} - измерение счетного режима в точке от времени
    ///
    /// _5_0* - Запуск после паузы
    ///
    /// _6_0* - Временная остановка измерения
    ///
    /// _7_0* - Полная остановка измерения
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
           
            currentRequest.Append('*');
            foreach (var value in values)
            {
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