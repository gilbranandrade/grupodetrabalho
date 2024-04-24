
document.addEventListener('DOMContentLoaded', function() {
  
    // GERAR DOCX
    const form = document.getElementById('formulario');
  
    form.addEventListener('submit', function(event) {
      event.preventDefault();
  
      const formData = new FormData(form);
      const data = {};
      formData.forEach((value, key) => {
        if (key.includes('[]')){
          novakey = key.replace(/\[\]/g, '');
  
          if (novakey in data){
            data.beach.push(value);
          } else {
            data[novakey] = [value];
          }
        }
        else {
          data[key] = value;
        }
        console.log(data[key]);
      });
  
      generateDocx(data);
    });
  
    function loadFile(url, callback) {
      PizZipUtils.getBinaryContent(url, callback);
    }
  
    function generateDocx(data) {
      loadFile(
        "./assets/templates/TemplateProtocoloCompromisso.docx",
        function (error, content) {
            if (error) {
                throw error;
            }
            //const TableModule = require("docxtemplater-table-module"); // adicionado para a tabela
            const zip = new PizZip(content);
            const doc = new window.docxtemplater(zip, {
                paragraphLoop: true,
                linebreaks: true,
                //modules: [new TableModule.Vertical()], // adicionado para a tabela
            });
  
            // BRINCANDO COM data
            /*data = {
              beach: [
                  { name: "Genipabu" },
                  { name: "Ponta Negra" },
                  { name: "Camurupim" },
              ],
            }*/
            // FIM DA BRINCADEIRA
  
            // Render the document 
            doc.render(data);
  
            const blob = doc.getZip().generate({
                type: "blob",
                mimeType:
                    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                // compression: DEFLATE adds a compression step.
                // For a 50MB output document, expect 500ms additional CPU time
                compression: "DEFLATE",
            });
            // Output the document using Data-URI
            saveAs(blob, "output.docx");
        }
      );
    }
  });