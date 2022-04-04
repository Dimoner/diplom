using System.Collections.Generic;
using System.Linq;
using AppServer.Controllers.Dto.Responses;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

namespace AppServer.Controllers.Filters
{
    /// <summary>
    /// Валидация состояния модели запрос его валидации
    /// </summary>
    public class ModelStateValidationActionFilterAttribute : ActionFilterAttribute
    {
        /// <inheritdoc />
        public override void OnActionExecuting(ActionExecutingContext context)
        {
            if (!context.ModelState.IsValid)
            {
                var errorControllerList = context.ModelState.Aggregate(new Dictionary<string, string[]>(), (source, value) =>
                {
                    var key = value.Key.ToLower();
                    var contentError = value.Value.Errors.Select(modelError => modelError.ErrorMessage).ToArray();
                    source.Add(key, contentError);
                    return source;
                });
                var result = new ErrorResponse
                {
                    ErrorText = "Ошибка валидации полей",
                    ErrorControllerList = errorControllerList
                };
                context.HttpContext.Response.StatusCode = 410;
                context.Result = new ObjectResult(result);
            }
        }
    }
}