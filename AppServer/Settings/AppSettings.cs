using AppServer.Settings.Interfaces;
using Microsoft.Extensions.Configuration;

namespace AppServer.Settings
{
    /// <inheritdoc />
    public class AppSettings : IAppSettings
    {
        private readonly IConfiguration _configuration;

        public AppSettings(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        /// <inheritdoc />
        public int ServerPort => _configuration.GetValue<int>("ServerPort");

        /// <inheritdoc />
        public string ServerUrl => _configuration.GetValue<string>("ServerUrl");

        /// <inheritdoc />
        public string ClientName => _configuration.GetValue<string>("ClientName");

        /// <inheritdoc />
        public string CredentialLogin => _configuration.GetValue<string>("CredentialLogin");

        /// <inheritdoc />
        public string CredentialPassword => _configuration.GetValue<string>("CredentialPassword");

        /// <inheritdoc />
        public string FromTopic => _configuration.GetValue<string>("FromTopic");

        /// <inheritdoc />
        public string ToTopic => _configuration.GetValue<string>("ToTopic");

        /// <inheritdoc />
        public string[] TopicList => new[] { FromTopic, ToTopic };
    }
}