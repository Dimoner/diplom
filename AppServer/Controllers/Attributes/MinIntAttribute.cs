using System;
using System.ComponentModel.DataAnnotations;

namespace AppServer.Controllers.Attributes
{
    /// <summary>
    /// Валидация чисел
    /// </summary>
    public class MinIntAttribute : ValidationAttribute
    {
        private readonly double _value;

        public MinIntAttribute(int maxValue)
        {
            _value = maxValue;
        }
        
        public MinIntAttribute(double minValue)
        {
            _value = minValue;
        }

        public MinIntAttribute(float minValue)
        {
            _value = minValue;
        }

        public override bool IsValid(object value)
        {
            var currentFormat = Convert.ToDouble(value);
            return currentFormat > _value;
        }
    }
}