using System;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using AppServer.Controllers.Dto.Requests;
using AppServer.Controllers.Dto.Requests.Base;
using AppServer.Controllers.Dto.Requests.Interfaces;
using AppServer.Domains;
using AppServer.Domains.MqttResponse.Models;
using AppServer.Helpers;
using AppServer.History.Interfaces;
using AppServer.History.Models;

namespace AppServer.History
{
    /// <inheritdoc />
    public class HistoryManager : IHistoryManager
    {
        /// <summary>
        /// Путь до базы с файлами
        /// </summary>
        private static readonly string _directoryPath = "./History/Files";

        public static FileHistoryModel WireInFile(MeasureMqttResponse mqttResponse)
        {
            var files = GetFilesFromDirectory();
            var currentFile = files.FirstOrDefault(info =>
            {
                var names = info.Name.Split('_');
                return names[0] == mqttResponse.Id.ToString();
            });
            
            var fileItem = GetFileHistory(currentFile);
            if (fileItem.SubType == SubActionTypeEnum.Range)
            {
                mqttResponse.X /= 100;
            }
            if (currentFile != null)
            {
                var xValue = BaseDetectRequest.GetMeasureCurrentFormat(mqttResponse.X);
                var yValue = BaseDetectRequest.GetMeasureCurrentFormat(mqttResponse.Y);
                File.AppendAllText(currentFile.FullName, $"\r{xValue}|{yValue}");
            }
            
            return fileItem;
        }

        /// <inheritdoc />
        public (FileHistoryModel[] historyModels, int totalElem) GetFileHistory(int start, int end, string name)
        {
            var baseFiles = GetFilesFromDirectory();
            var afterFilterData = baseFiles
                .Select(GetFileHistory)
                .Where(file =>
                {
                    if (string.IsNullOrWhiteSpace(name))
                    {
                        return true;
                    }

                    var dateInString = file.CreationDateTime.ToString("DD.MM.yyyy");
                    var dateInStringTime = file.CreationDateTime.ToString("HH:mm:ss tt zz:mm:ss");
                    return $"{dateInString} {dateInStringTime}".Contains(name) || file.MeasureName.Contains(name) ||
                           file.Description.Contains(name);
                }).ToArray();
            var files = afterFilterData
                .OrderByDescending(value => value.CreationDateTime)
                .ToArray();

            var result = files
                .Where((_, index) => index >= start && index < end)
                .ToArray();

            return (result, files.Length);
        }

        /// <inheritdoc />
        public async Task<byte[]> DownloadFileAsync(int id)
        {
            var files = GetFilesFromDirectory(); //Getting Text files

            var currentFileInfo = files.FirstOrDefault(file =>
            {
                var name = file.Name;
                var values = name.Split('_');
                return Convert.ToInt32(values[0]) == id;
            });

            if (currentFileInfo == null)
            {
                throw new Exception("File not found");
            }

            return await File.ReadAllBytesAsync(currentFileInfo.FullName);
        }

        /// <inheritdoc />
        public int CreateNewFile<T>(T dto) where T : BaseDetectRequest, IBaseApiRequest
        {
            var d = GetLastNumberId();
            d += 1;
            var dateTimeString = DateTime.Now.ToString("dd.MM.yyyy--HH-mm-ss");
            var fileName = $"{d}_{dateTimeString}.txt";

            var fullFileName = _directoryPath + $"/{fileName}";
            File.Create(fullFileName).Dispose();
            File.WriteAllText(fullFileName, $@"Name: 
{dto.MeasureName}
-----------------------------------------
Date: {DateTime.Now:dd.MM.yyyy HH-mm-ss} 
-----------------------------------------
MeasureType: {dto.ActionType}
-----------------------------------------
MeasureSubType: {(dto.GetType() == typeof(StartDetectRangeRequest) ? SubActionTypeEnum.Range : SubActionTypeEnum.Time)}
-----------------------------------------
Description:
{dto.Description}
-----------------------------------------
Measure:
{dto.CreateTableHeader()}
-----------------------------------------");


            return d;
        }


        /// <summary>
        /// Определяем какой идентификатор файла последний
        /// </summary>
        private int GetLastNumberId()
        {
            var files = GetFilesFromDirectory(); //Getting Text files
            if (files.Length == 0)
            {
                return 0;
            }

            var fileIdListList = files.Select(file =>
            {
                var name = file.Name;
                var values = name.Split('_');
                return Convert.ToInt32(values[0]);
            }).Max();

            return fileIdListList;
        }

        /// <summary>
        /// Загрузка истории по 1 файлу
        /// </summary>
        private static FileHistoryModel GetFileHistory(FileInfo file)
        {
            var text = File.ReadAllText(file.FullName);
            var description = text.GetPartOfString("Description:", "-----------------------------------------");
            var measureType = text.GetPartOfString("MeasureType:", "-----------------------------------------");
            var measureSubType =
                text.GetPartOfString("MeasureSubType:", "-----------------------------------------");
            var measureName = text.GetPartOfString("Name:", "-----------------------------------------");
            var names = file.Name.Split('_');

            var measureTypeString = measureType == ActionTypeEnum.Amperage.ToString()
                ? "Режим: токовый"
                : "Режим: счетный";
            var measureSubTypeString = measureSubType == SubActionTypeEnum.Range.ToString()
                ? "Тип: на промежутке"
                : "Тип: от времени";

            return new FileHistoryModel
            {
                Id = Convert.ToInt32(names[0]),
                SubType = measureSubType == SubActionTypeEnum.Range.ToString() ? SubActionTypeEnum.Range : SubActionTypeEnum.Time,
                TypeAction = measureType == ActionTypeEnum.Amperage.ToString() ? ActionTypeEnum.Amperage : ActionTypeEnum.Tick,
                MeasureType = $"{measureTypeString} \n {measureSubTypeString}",
                CreationDateTime = MeasureHelper.GetCurrentDateTimeFromMeasureDate(names[1]),
                Description = description,
                MeasureName = measureName
            };
        }

        private static FileInfo[] GetFilesFromDirectory()
        {
            var directoryInfo = new DirectoryInfo(_directoryPath); //Assuming Test is your Folder
            if (!directoryInfo.Exists)
            {
                directoryInfo = Directory.CreateDirectory(_directoryPath);
            }

            var files = directoryInfo.GetFiles("*.txt"); //Getting Text files

            return files;
        }
    }
}