document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('beachForm');
  
    form.addEventListener('submit', function(event) {
      event.preventDefault();
  
      const formData = new FormData(form);
      const data = {};
      formData.forEach((value, key) => {
        data[key] = value;
      });
  
      generateDocx(data);
    });
  
    function generateDocx(data) {
        fetch('template.docx')
          .then(response => response.arrayBuffer())
          .then(template => {
            const zip = new PizZip(template);
            const doc = new window.docxtemplater(zip, {
                paragraphLoop: true,
                linebreaks: true,
            });
            doc.loadZip(zip);
            doc.setData(data);
            try {
              doc.render();
              console.error('To tentando renderizar');
            } catch (error) {
              console.error('Error rendering document:', error);
              return;
            }
      
            // Inserir praias na tabela
            const content = doc.getZip().file('word/document.xml').asText();
            const beaches = data['beach[]'];
            if (beaches && beaches.length > 0) {
                console.error('Entrei no IF');
              let beachRows = '';
              beaches.forEach(beach => {
                beachRows += `<w:tr><w:tc><w:p><w:r><w:t>${beach}</w:t></w:r></w:p></w:tc></w:tr>`;
              });
              const updatedContent = content.replace('<w:tr><w:tc><w:p><w:r><w:t></w:t></w:r></w:p></w:tc></w:tr>', beachRows);
              doc.getZip().file('word/document.xml', updatedContent);
            }
      
            const output = doc.getZip().generate({ type: 'blob' });
            console.error('vou gerar arquivo');
            saveAs(output, 'formulario.docx');
          });
    }
});
  