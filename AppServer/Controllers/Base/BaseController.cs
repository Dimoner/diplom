using AppServer.Controllers.Dto.Responses;
using AppServer.Controllers.Filters;
using Microsoft.AspNetCore.Mvc;

namespace AppServer.Controllers.Base
{
    /// <summary>
    /// Базовый контроллер
    /// </summary>
    [ModelStateValidationActionFilter]
    public class BaseController : Controller
    {
        /// <summary>
        /// логика формирования ошибки для ответа сервера
        /// </summary>
        protected IActionResult Error(string message)
        {
            var result = new ErrorResponse
            {
                ErrorText = message
            };
            Response.StatusCode = 400;
            return new ObjectResult(result);
        }
    }
}