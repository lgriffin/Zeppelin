#!/usr/bin/env node
/* 
 * Author: P.Elger
 *
 * THIS SOFTWARE IS PROVIDED ``AS IS'' AND ANY EXPRESSED OR IMPLIED 
 * WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES 
 * OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE 
 * DISCLAIMED.  IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY DIRECT, 
 * INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES 
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR 
 * SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) 
 * HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, 
 * STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING 
 * IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE 
 * POSSIBILITY OF SUCH DAMAGE. 
 */         

var sys = require("sys");
var fs = require("fs");
var npm = require("npm");
var util = require("util");
var zeppelinCore = require('../core/zeppelin_core');


var recurseFs = function(dir, pattern, onFileCallback, onDirectoryCallback, onCompleteCallback)
{
  var files = fs.readdirSync(dir);
  for (var index = 0; index < files.length; ++index)
  {
    var current = fs.statSync(dir + "/" + files[index]);

    if (null != onFileCallback && !current.isDirectory() && !current.isSymbolicLink())
    {
      if (pattern.test(files[index]))
      {
        onFileCallback(dir + "/" + files[index]);
      }
    }
    else if (current.isDirectory() && !current.isSymbolicLink())
    {
      if (null != onDirectoryCallback && pattern.test(files[index]))
      {
        onDirectoryCallback(dir + "/" + files[index]);
      }
      recurseFs(dir + "/" + files[index], pattern, onFileCallback, onDirectoryCallback);
    }
  }
}


recurseCopy = function(source, dest)
{
  var split;
  var is;
  var os;

  try { fs.mkdirSync(dest, 0755); } catch (e) { }
  recurseFs(source, /.*/,
              function(file)
              {
                split = file.split(source);
                var is = fs.createReadStream(file)
                var os = fs.createWriteStream(dest + split[1]);
                util.pump(is, os, function() 
                {
                });
              },
              function(dir)
              {
                split = dir.split(source);
                try { fs.mkdirSync(dest + split[1], 0755); } catch (e) { }
              });
}



run = function(path)
{
  var config = require(path).config;
  sys.puts("");
  sys.puts("Zeppelin");
  zeppelinCore.tearUp(config, function()
  {
    //zeppelinCore.tearDown();
  });
}


install = function(targetPath)
{
  var sourcePath;

  sourcePath = npm.config.get("root") + "/.npm/zeppelin/active/package/canonical";

  sys.puts("");
  sys.puts("Zeppelin");
  sys.puts("Creating installation root at: " + targetPath);
  sys.puts("");
  sys.puts("To start up zeppelin run:");
  sys.puts("zeppelin run " + targetPath + "/config.js");
  sys.puts("");
  sys.puts("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
  sys.puts("!!!! Zeppelin requires mongodb to be running on its default port of 27017 !!!!");
  sys.puts("!!!! otherwise it will report a socket connection error                   !!!!");
  sys.puts("!!!! we are working on this (honest)                                      !!!!");
  sys.puts("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
  sys.puts("");
  sys.puts("To create some sample data:");
  sys.puts("$cd quoteorama/test/unit/");
  sys.puts("$node data.js");
  sys.puts("");
  sys.puts("To access a sample application point your browser to http://localhost:3500/quoteorama/index.html");
  sys.puts("");
  sys.puts("Enjoy!");
  sys.puts("");
  recurseCopy(sourcePath, targetPath);

  fs.readFile(sourcePath + "/config.js", function (err, data) 
  {
    if (err) throw err;
    var editConfig = data.toString("utf8").replace("__PATH__", targetPath);
    fs.writeFile(targetPath + "/config.js", editConfig, function (err)
    {
      if (err) throw err;
    });
  });
}


if (process.argv.length > 3)
{
  var command;
  var path;
  process.argv.forEach(function(val, index, array) 
  {
    if (index == 2)
    {
      command = val;
    }
    if (index == 3)
    {
      var configPath;
      if (val.charAt(0) != '/')
      {
        path = process.cwd() + '/' + val;
      }
      else
      {
        path = val;
      }
    }
  });

  if (command === "run")
  {
    run(path);
  }

  if (command === "install")
  {
    install(path);
  }
}
else
{
  sys.puts("Zeppelin Usage");
  sys.puts("==============");
  sys.puts("");
  sys.puts("zeppelin run <config location>");
  sys.puts("zeppelin install <install location>");
  sys.puts("");
}

