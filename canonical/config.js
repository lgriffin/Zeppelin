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

exports.config = 
{
  live: {environment: "development", i18n: "en"},

  "applications": [{name: "examples",
                    description: "example applications",
                    hostIp: "localhost",
                    portNumber: 3500,
                    roots: ["__PATH__"]}],

  environments: {test: 
                  {database: { driver: "mongo",
                               host: "localhost",
                               port: 27017}},
                 development: 
                  {database: { driver: "mongo",
                               host: "localhost",
                               port: 27017}},
                 production: 
                  {database: { driver: "mongo",
                               host: "localhost",
                               port: 27017}}},
  i18n: ["en-gb"]
}

