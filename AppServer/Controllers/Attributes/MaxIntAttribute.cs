using System;
using System.ComponentModel.DataAnnotations;

namespace AppServer.Controllers.Attributes
{
    /// <summary>
    /// Валидация чисел
    /// </summary>
    public class MaxIntAttribute : ValidationAttribute
    {
        private readonly double _value;

        public MaxIntAttribute(int maxValue)
        {
            _value = maxValue;
        }
        
        public MaxIntAttribute(double minValue)
        {
            _value = minValue;
        }

        public MaxIntAttribute(float minValue)
        {
            _value = minValue;
        }

        public override bool IsValid(object value)
        {
            var currentFormat = Convert.ToDouble(value);
            return currentFormat < _value;
        }
    }
}