import re

with open('src/components/AddUserLayer.jsx', 'r') as f:
    content = f.read()

# Expand the container
content = content.replace('className="col-xxl-6 col-xl-8 col-lg-10"', 'className="col-xxl-8 col-xl-10 col-lg-12"')

# Find the form block
form_start = content.find('<form onSubmit={handleSubmit}>')
form_end = content.find('</form>', form_start)

form_content = content[form_start:form_end]

# Add row div
form_content = form_content.replace('<form onSubmit={handleSubmit}>\n', '<form onSubmit={handleSubmit}>\n                                    <div className="row">\n')

# Replace field mb-20 with col-md-6 mb-20
# Be careful not to replace mb-20 inside avatar etc. But we are only replacing inside the form
form_content = form_content.replace('<div className="mb-20">', '<div className="col-md-6 mb-20">')

# Close the row div before the buttons
# The buttons are wrapped in <div className="d-flex align-items-center justify-content-center gap-3">
button_start = form_content.find('<div className="d-flex align-items-center justify-content-center gap-3">')
form_content = form_content[:button_start] + '                                    </div>\n                                    ' + form_content[button_start:]

content = content[:form_start] + form_content + content[form_end:]

with open('src/components/AddUserLayer.jsx', 'w') as f:
    f.write(content)

