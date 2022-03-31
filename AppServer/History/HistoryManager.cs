using System;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using AppServer.Controllers.Dto.Requests.Base;
using AppServer.Controllers.Dto.Requests.Interfaces;
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

        public static void WireInFile(MeasureMqttResponse mqttResponse)
        {
            var files = GetFilesFromDirectory();
            var currentFile = files.FirstOrDefault(info =>
            {
                var names = info.Name.Split('_');
                return names[0] == mqttResponse.Id.ToString();
            });

            if (currentFile != null)
            {
                var xValue = mqttResponse.X.ToString();
                var yValue = mqttResponse.Y.ToString();
                File.AppendAllText(currentFile.FullName, $"\r{xValue}       | {yValue}");
            }
        }

        /// <inheritdoc />
        public (FileHistoryModel[] historyModels, int totalElem) GetFileHistory(int start, int end, string name)
        {
            var files = GetFilesFromDirectory()
                .Where(file => !string.IsNullOrWhiteSpace(name) || file.Name.Contains(name ?? ""))
                .ToArray();
            
            var result = files
                .Where((_, index) => index >= start && index <= end)
                .Select(fileInfo =>
            {
                var text = File.ReadAllText(fileInfo.FullName);
                var description = text.GetPartOfString("Description:", "-----------------------------------------");
                var measureName = text.GetPartOfString("Name:", "-----------------------------------------");
                var names = fileInfo.Name.Split('_');
                
                
                return new FileHistoryModel
                {
                    Id = Convert.ToInt32(names[0]),
                    CreationDateTime = names[1],
                    Description = description,
                    MeasureName = measureName
                };
            }).ToArray();
            
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
            var dateTimeString = DateTime.Now.ToString("yyyy-MM-dd--HH-mm-ss");
            var fileName = $"{d}_{dateTimeString}.txt";

            var fullFileName = _directoryPath + $"/{fileName}";
            File.Create(fullFileName).Dispose();
           
            if (!string.IsNullOrWhiteSpace(dto.Description))
            {
                File.WriteAllText(fullFileName, $@"Name: 
{dto.MeasureName}
-----------------------------------------
Description:
{dto.Description}
-----------------------------------------
Measure:
{dto.CreateTableHeader()}
-----------------------------------------
                ");
            }

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