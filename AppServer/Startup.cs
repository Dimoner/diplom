using System;
using AppServer.Controllers;
using AppServer.History;
using AppServer.History.Interfaces;
using AppServer.Managers;
using AppServer.Managers.Interfaces;
using AppServer.MqttLogic;
using AppServer.MqttLogic.Managers;
using AppServer.Settings;
using AppServer.Settings.Interfaces;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

namespace AppServer
{
    public  class Startup
    {
        private readonly IAppSettings _appSettings;
        
        public Startup(IConfiguration configuration)
        {
            _appSettings = new AppSettings(configuration);
        }
        
        public  void ConfigureServices(IServiceCollection services)
        {
            services.AddSingleton<IAppSettings, AppSettings>();
            services.AddTransient<IMeasureManager, MeasureManager>();
            services.AddTransient<IHistoryManager, HistoryManager>();
            services.AddTransient<IControlMeasureManager, ControlMeasureManager>();
            services.InitMqtt(_appSettings);
            services.AddControllers();
            
            services.AddSignalR();
            
            services.AddCors(options => options.AddPolicy("CorsPolicy",
                builder =>
                {
                    builder.AllowAnyHeader()
                        .AllowAnyMethod()
                        .SetIsOriginAllowed((host) => true)
                        .AllowCredentials();
                }));

        }

        
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            app.UseCors("CorsPolicy");
            
            app.UseStatusCodePagesWithReExecute("/error", "?code={0}");
            app.UseStaticFiles();
            app.UseRouting();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
                endpoints.MapHub<MeasureHub>("/measure");
                endpoints.MapHub<StateHub>("/state");
            });
            
            var scope = app.ApplicationServices.CreateScope().ServiceProvider;
            MqttManager.Init(scope);
        }
    }
}