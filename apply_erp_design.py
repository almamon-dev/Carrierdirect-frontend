import os
import re

src_path = 'src/modules/Customer/QuoteManagement/CreateRequest/Create.tsx'
edit_path = 'src/modules/Customer/QuoteManagement/CreateRequest/Edit.tsx'
view_path = 'src/modules/Customer/QuoteManagement/CreateRequest/View.tsx'

with open(src_path, 'r', encoding='utf-8') as f:
    create_content = f.read()

# ----------------- EDIT.TSX -----------------
edit_content = create_content.replace('Create Quote Request', 'Edit Quote Request')
edit_content = edit_content.replace('CreateRequestForm', 'EditRequestForm')
edit_content = edit_content.replace('Save Draft', 'Update Draft')
edit_content = edit_content.replace('Submit Request', 'Save Changes')
edit_content = edit_content.replace("Fill in the required information to submit a request.", "Update the required information to modify the request.")

with open(edit_path, 'w', encoding='utf-8') as f:
    f.write(edit_content)


# ----------------- VIEW.TSX -----------------
view_content = create_content.replace('Create Quote Request', 'View Quote Request')
view_content = view_content.replace('CreateRequestForm', 'ViewRequestForm')
view_content = view_content.replace('Fill in the required information to submit a request.', 'Review the details of your quote request.')

# Update the bottom submit button
view_content = view_content.replace('<Send size={18} /> Submit Request', '<Save size={18} /> Print Request')
view_content = view_content.replace('Ready to submit?', 'Ready to print or save?')
view_content = view_content.replace('Please review your quote request details before submission.', 'You can review and export these details.')

# Right Header Buttons
view_content = re.sub(
    r'<Button variant="outline" size="sm"[^>]*>Cancel</Button>\s*<Button variant="outline"[^>]*>.*?Save Draft\s*</Button>',
    '<Button variant="outline" size="sm" className="h-[32px] text-[14px]" onClick={() => navigate(-1)}>Back</Button>\\n                    <Button variant="primary" size="sm" className="h-[32px] text-[14px] flex items-center gap-2" onClick={() => navigate("../edit")}><Settings size={14}/> Edit Request</Button>',
    view_content,
    flags=re.DOTALL
)

def input_replacer(match):
    val = match.group(1)
    if "images" in val or "packingList" in val or "invoice" in val:
        return match.group(0) # Keep file inputs
    return f'<div className="text-[14px] font-medium text-slate-800 min-h-[36px] flex items-center py-2 border-b border-slate-100">{{{val} || \'--\'}}</div>'

view_content = re.sub(r'<Input[^>]*value=\{([^\}]+)\}[^>]*>', input_replacer, view_content)
view_content = re.sub(r'<Textarea[^>]*value=\{([^\}]+)\}[^>]*>', input_replacer, view_content)
view_content = re.sub(r'<Select[^>]*value=\{([^\}]+)\}[^>]*>.*?</Select>', input_replacer, view_content, flags=re.DOTALL)

def checkbox_replacer(match):
    checked = match.group(1)
    label = match.group(2)
    return f'{{{checked} ? <span className="text-[13px] font-medium text-slate-800 flex items-center gap-2"><CheckCircle2 size={{14}} className="text-emerald-500" /> {label}</span> : <span className="text-[13px] font-medium text-slate-400 flex items-center gap-2 line-through"><CheckCircle2 size={{14}} className="text-slate-300" /> {label}</span>}}'

view_content = re.sub(r'<Checkbox[^>]*checked=\{([^\}]+)\}[^>]*label="([^"]+)"[^>]*>', checkbox_replacer, view_content)

view_content = re.sub(r'<Input type="file"[^>]*>', '', view_content) # just remove file inputs, keep the preview links

with open(view_path, 'w', encoding='utf-8') as f:
    f.write(view_content)
print("Edit.tsx and View.tsx generated!")
