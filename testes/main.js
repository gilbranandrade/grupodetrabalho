document.getElementById('campos').addEventListener('click', function(event) {
  if (event.target.classList.contains('removerCampo')) {
      event.target.parentNode.remove();
  }
});

document.getElementById('adicionarPraia').addEventListener('click', function() {
  var camposDiv = document.getElementById('campos');
  var novoCampo = document.createElement('div');
  novoCampo.classList.add('form-group');
  novoCampo.innerHTML = '<input type="text" class="beach" name="beach[]" required><button type="button" class="removerCampo">Remover</button>';
  camposDiv.appendChild(novoCampo);
});

document.addEventListener('DOMContentLoaded', function() {

  // GERAR DOCX
  const form = document.getElementById('beachForm');

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
    });

    generateDocx(data);
  });

  function loadFile(url, callback) {
    PizZipUtils.getBinaryContent(url, callback);
  }

  function generateDocx(data) {
    loadFile(
      "./input.docx",
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