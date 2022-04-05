using System;
using System.Threading.Tasks;
using AppServer.Controllers.Base;
using AppServer.Managers.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace AppServer.Controllers
{
    /// <summary>
    /// Контроллер для паузы/старта после паузы/стопа измерений
    /// </summary>
    [Route("control-measure")]
    public class ControlMeasureController : BaseController
    {
        private readonly IControlMeasureManager _controlMeasureManager;

        public ControlMeasureController(IControlMeasureManager controlMeasureManager)
        {
            _controlMeasureManager = controlMeasureManager;
        }
        
        /// <summary>
        /// Вызывается после команды pause
        /// Продолжает измерения с момента остановки
        /// </summary>
        [HttpGet("start")]
        public async Task<IActionResult> StartAsync()
        {
            try
            {
                await _controlMeasureManager.StartAsync();
                return Ok();
            }
            catch (Exception e)
            {
                return Error(e.Message);
            }
        }
        
        /// <summary>
        /// Приостанавливает измерения до момента нажатия кнопки start
        /// </summary>
        [HttpGet("pause")]
        public async Task<IActionResult> PauseAsync()
        {
            try
            {
                await _controlMeasureManager.PauseAsync();
                return Ok();
            }
            catch (Exception e)
            {
                return Error(e.Message);
            }
        }
        
        /// <summary>
        /// Полностью прекращаются измерения
        /// Очищаются все значения для контроллера
        /// </summary>
        [HttpGet("stop")]
        public async Task<IActionResult> StopAsync()
        {
            try
            {
                await _controlMeasureManager.StopAsync();
                return Ok();
            }
            catch (Exception e)
            {
                return Error(e.Message);
            }
        }
    }
}