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

var sys = require('sys');
var connect = require('connect');
var zeppelin = require('./zeppelin');
var zfs = require('./zeppelin_fs');

/*---------------------------------------------------------
 * zeppelin static stack handling */


/**
 * scan app folder for public roots and create static stacks
 * store stacks in map
 */
exports.tearUp = function(config, callback)
{
  publicRoots = [];
  publicRootsViewIndex = {};

  locatePublicRoots(config);
  publicRoots.sort(sortFunction);
  locateSystemStack();
  printRoots();
  createStacks(publicRoots);
  callback(publicRoots, publicRootsViewIndex, publicStacks);
}


/**
 * re-scan for new applications and reinialise static stacks map
 */
exports.hup = function()
{
}


exports.roots = function()
{
  return publicRoots;
}


/*---------------------------------------------------------
 * module private */

var publicRoots = [];
var publicStacks = [];
var publicRootsViewIndex = {};

createStacks = function(roots)
{
  publicStacks = [];
  for (var rootIndex = 0; rootIndex < roots.length; ++rootIndex)
  {
    publicStacks.push(connect.createServer(connect.staticProvider({ root: roots[rootIndex], maxAge: 1})));
  }
}


printRoots = function()
{
  sys.puts("");
  sys.puts("zeppelin static serving data from:");
  sys.puts("");
  for (var stackIndex = 0; stackIndex < publicRoots.length; ++stackIndex)
  {
    sys.puts("  " + publicRoots[stackIndex]);
  }
}


/**
 * locate system public stack area
 */
locateSystemStack = function()
{
  publicRoots.push(zeppelin.installationPublicRoot());
}


/**
 * locates public stacks then order on length so that shorter paths (higher up)
 * get searched first
 */
locatePublicRoots = function(config)
{
  for (var applicationIndex = 0; applicationIndex < config.applications.length; ++applicationIndex)
  {
    for (var rootIndex = 0; rootIndex < config.applications[applicationIndex].roots.length; ++rootIndex)
    {
      zfs.recurse(config.applications[applicationIndex].roots[rootIndex],
                  /public/,
                  null,
                  function(dir)
                  {
                    publicRoots.push(dir);
                    var viewIndex = dir.split(config.applications[applicationIndex].roots[rootIndex]);
                    viewIndex = viewIndex[1].split("/public");
                    viewIndex = viewIndex[0].split("/");
                    if (viewIndex.length == 3)
                    {
                      publicRootsViewIndex[viewIndex[1] + "." + viewIndex[2]] = dir;
                    }
                    else
                    {
                      publicRootsViewIndex[viewIndex[1]] = dir;
                    }
                  });
    }
  }
}


sortFunction = function(string1, string2)
{
  return string2.length - string1.length;
}

