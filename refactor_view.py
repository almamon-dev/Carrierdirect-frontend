import re

path = 'src/modules/Customer/QuoteManagement/CreateRequest/View.tsx'

with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

view_field_def = """const ViewField = ({ label, value, children, isLink = false, linkHref = "", colSpan = false }: { label: string, value?: React.ReactNode, children?: React.ReactNode, isLink?: boolean, linkHref?: string, colSpan?: boolean }) => (
    <div className={`${colSpan ? 'col-span-1 md:col-span-2' : ''} grid grid-cols-[160px_10px_1fr] items-start mb-1`}>
        <p className="text-[14px] text-slate-500 font-medium py-1.5">{label}</p>
        <p className="text-[14px] text-slate-400 py-1.5">:</p>
        <div className="py-1.5 w-full">
            {children ? children : isLink ? (
                <a href={linkHref} target={linkHref.startsWith('http') ? "_blank" : "_self"} className="text-[14px] font-semibold text-blue-600 hover:underline break-all">
                    {value || 'N/A'}
                </a>
            ) : (
                <div className="text-[14px] font-semibold text-slate-800 break-words">{value || <span className="text-[13px] text-slate-400 font-normal italic">Not specified</span>}</div>
            )}
        </div>
    </div>
);"""

# Replace FormRow definition
content = re.sub(
    r'const FormRow = \(\{.*?\}\);',
    view_field_def,
    content,
    flags=re.DOTALL
)

# Convert mapped FormRows to ViewFields
def replace_form_row(match):
    label = match.group(1)
    props = match.group(2).replace('required', '') # Remove required prop
    field = match.group(3)
    
    # Handle links for emails/urls
    is_link = ''
    if 'Email' in label:
        is_link = f' isLink linkHref={{`mailto:${{formData.{field}}}`}}'
    elif 'URL' in label or 'Website' in label:
        is_link = f' isLink linkHref={{formData.{field}}}'
    elif 'Phone' in label:
        is_link = f' isLink linkHref={{`tel:${{formData.{field}}}`}}'

    return f'<ViewField label="{label}"{props} value={{formData.{field}}}{is_link} />'

content = re.sub(
    r'<FormRow label="([^"]+)"(.*?)>\s*<div[^>]*>\{formData\.([^ }]+) \|\| \'--\'\}</div>\s*</FormRow>',
    replace_form_row,
    content
)

# Convert any remaining FormRow to ViewField
content = content.replace('<FormRow', '<ViewField').replace('</FormRow>', '</ViewField>')

# Change the Request Number 
content = content.replace(
    '<ViewField label="Request Number">\n                                        <Input value="REQ-9824" disabled className="bg-slate-50 text-slate-500 font-semibold" />\n                                    </ViewField>',
    '<ViewField label="Request Number" value={<span className="font-mono text-indigo-600 font-bold bg-indigo-50 px-2 py-0.5 rounded">REQ-9824</span>} />'
)

# Style improvements to Dimensions block
content = content.replace(
    '<div className="text-[14px] font-medium text-slate-800 min-h-[36px] flex items-center py-2 border-b border-slate-100">{dim.',
    '<div className="text-[14px] font-bold text-slate-800 min-h-[36px] flex items-center py-1">{dim.'
)

# Remove bg-slate-50 from Load Characteristics
content = content.replace('bg-slate-50 p-3 rounded-md border border-slate-200', '')
content = content.replace('bg-slate-50 p-4 rounded-md border border-slate-200', '')

# Enhance Budget & Expiration visual
content = content.replace(
    '<div className="text-[14px] font-medium text-slate-800 min-h-[36px] flex items-center py-2 border-b border-slate-100">{formData.budget || \'--\'}</div>',
    '<div className="text-[16px] font-bold text-emerald-600 flex items-center py-1">{formData.budget || \'--\'}</div>'
)
content = content.replace(
    '<div className="text-[14px] font-medium text-slate-800 min-h-[36px] flex items-center py-2 border-b border-slate-100">{formData.currency || \'--\'}</div>',
    '<div className="text-[14px] font-bold text-emerald-700 flex items-center py-1 ml-1 pt-1.5">{formData.currency || \'--\'}</div>'
)

content = content.replace(
    '<div className="text-[14px] font-medium text-slate-800 min-h-[36px] flex items-center py-2 border-b border-slate-100">{formData.autoExpire || \'--\'}</div>',
    '<div className="text-[14px] font-semibold text-slate-800 flex items-center py-1">{formData.autoExpire || \'--\'}</div>'
)

# Clean up Notes
content = content.replace(
    '<div className="text-[14px] font-medium text-slate-800 min-h-[36px] flex items-center py-2 border-b border-slate-100">{formData.customerNotes || \'--\'}</div>',
    '<div className="text-[14px] font-semibold text-slate-800 flex items-center py-1 bg-slate-50 p-3 rounded border border-slate-100">{formData.customerNotes || <span className="italic text-slate-400 font-normal">None</span>}</div>'
)
content = content.replace(
    '<div className="text-[14px] font-medium text-slate-800 min-h-[36px] flex items-center py-2 border-b border-slate-100">{formData.specialInstructions || \'--\'}</div>',
    '<div className="text-[14px] font-semibold text-slate-800 flex items-center py-1 bg-slate-50 p-3 rounded border border-slate-100">{formData.specialInstructions || <span className="italic text-slate-400 font-normal">None</span>}</div>'
)
content = content.replace(
    '<div className="text-[14px] font-medium text-slate-800 min-h-[36px] flex items-center py-2 border-b border-slate-100">{formData.internalReference || \'--\'}</div>',
    '<div className="text-[14px] font-mono font-medium text-slate-600 flex items-center py-1">{formData.internalReference || \'--\'}</div>'
)

# Change badge styling of priorities
content = content.replace('value={formData.priority}', 'value={<span className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-amber-100 text-amber-700 border border-amber-200 w-fit">{formData.priority}</span>}')

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
print("View.tsx refactored to match Enterprise layout!")
