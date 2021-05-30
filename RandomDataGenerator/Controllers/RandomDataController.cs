using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.IO;
using Newtonsoft.Json.Linq;

namespace RandomDataGenerator.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class RandomDataController: Controller
    {
        [HttpPost("[action]")]
        public ActionResult GenerateFile([FromBody] object body)
        {
            string json = System.Text.Json.JsonSerializer.Serialize(body);
            dynamic param = JObject.Parse(json);

            try
            {
                string path = Environment.CurrentDirectory.Replace("Controllers", "") + "\\Utils\\randomData.txt";
                StreamWriter sw = new StreamWriter(path);
                sw.WriteLine(param.text);
                sw.Close();

                return Json(new { success = true });
            }
            catch (Exception ex)
            {
                return Json(new { success = false });
            }
        }

        [HttpGet("[action]")]
        public ActionResult GetRandomData()
        {
            int totalNumeric = 0, totalAlphanumeric = 0, totalFloat = 0, grandTotal = 0;
            var topItems = new List<object>();

            string path = Environment.CurrentDirectory.Replace("Controllers","")+"\\Utils\\randomData.txt";
            StreamReader sr = new StreamReader(path);
            string allData = sr.ReadToEnd();
            sr.Close();
            string[] dataList = allData.Split(", ");
            foreach (var item in dataList)
            {
                if (item != "")
                {
                    if (int.TryParse(item.ToString().Trim(), out _))
                    {
                        totalNumeric += 1;
                        if (grandTotal < 20)
                        {
                            topItems.Add(new { text = item + " - Numeric" });
                        }
                        grandTotal += 1;
                    }
                    else if (Decimal.TryParse(item.ToString().Trim(), out _))
                    {
                        totalFloat += 1;
                        if (grandTotal < 20)
                        {
                            topItems.Add(new { text = item + " - Float" });
                        }
                        grandTotal += 1;
                    }
                    else
                    {
                        totalAlphanumeric += 1;
                        if (grandTotal < 20)
                        {
                            topItems.Add(new { text = item.Trim() + " - Alphanumeric" });
                        }
                        grandTotal += 1;
                    }
                }
            }

            if (grandTotal > 0)
            {
                var report = new
                {
                    percentages = new
                    {
                        numericPercentage = (totalNumeric * 100) / grandTotal,
                        alphanumericPercentage = (totalAlphanumeric * 100) / grandTotal,
                        floatPercentage = (totalFloat * 100) / grandTotal,
                    },
                    topItems = topItems
                };

                return Json(report);
            }
            else
            {
                var report = new
                {
                    percentages = new
                    {
                        numericPercentage = 0,
                        alphanumericPercentage = 0,
                        floatPercentage = 0,
                    },
                    topItems = topItems
                };

                return Json(report);
            }

        }
    }
}
