using System;
using System.Threading.Tasks;
using AppServer.Controllers.Base;
using AppServer.Controllers.Dto.Requests;
using AppServer.Managers.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace AppServer.Controllers
{
    /// <summary>
    /// Запросы на устройство
    /// </summary>
    [Route("logic")]
    public class LogicController : BaseController
    {
        private readonly IMeasureManager _measureManager;

        public LogicController(IMeasureManager measureManager)
        {
            _measureManager = measureManager;
        }
        
        /// <summary>
        /// Проверка состояния устройства, что оно готово к работе
        /// </summary>
        [HttpGet("check-state")]
        public async Task<IActionResult> CheckStateAsync()
        {
            try
            {
                await _measureManager.CheckStateAsync();
                return Ok();
            }
            catch (Exception e)
            {
                return Error(e.Message);
            }
        }
        
        /// <summary>
        /// Сообщение шаговому двигателю перевести монохроматор в соотвествующее положение
        /// </summary>
        [HttpPost("change-position")]
        public async Task<IActionResult> ChangePositionAsync([FromBody] ChangePositionRequest dto)
        {
            try
            {
                await _measureManager.ChangePositionAsync(dto);
                return Ok();
            }
            catch (Exception e)
            {
                return Error(e.Message);
            }
        }
        
        /// <summary>
        /// Запрос на начало измерения от времени
        /// </summary>
        [HttpPost("start-detect-time")]
        public async Task<IActionResult> StartDetectTimeAsync([FromBody] StartDetectTimeRequest dto)
        {
            try
            {
                await _measureManager.StartDetectAsync(dto);
                return Ok();
            }
            catch (Exception e)
            {
                return Error(e.Message);
            }
        }
        
        /// <summary>
        /// Запрос на начало измерения от времени
        /// </summary>
        [HttpPost("start-detect-range")]
        public async Task<IActionResult> StartDetectRangeAsync([FromBody] StartDetectRangeRequest dto)
        {
            try
            {
                await _measureManager.StartDetectAsync(dto);
                return Ok();
            }
            catch (Exception e)
            {
                return Error(e.Message);
            }
        }
    }
}