using System.ComponentModel.DataAnnotations;

namespace AppServer.Controllers.Attributes
{
    /// <summary>
    /// Переданное число должно быть больше 0
    /// </summary>
    public class PosNumberNoZeroAttribute : ValidationAttribute {
        public PosNumberNoZeroAttribute() : base("Поле должно быть больше 0")
        {
            
        }
        
        public override bool IsValid(object value) {
            if (value == null) {
                return true;
            }
            int getal;
            if (int.TryParse(value.ToString(), out getal)) {

                if (getal == 0)
                    return false;

                if (getal > 0)
                    return true;
            }
            return false;

        }
    }
}