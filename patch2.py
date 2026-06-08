import re

with open('/Users/sanjaynaveen/Grip_admin/src/components/PaymentListLayer.jsx', 'r') as f:
    content = f.read()

content = content.replace('''            setFormData({
                topic: paymentToEdit.topic,
                amount: paymentToEdit.amount,
                chapters: selectedChapters,''',
'''            const selectedZoneId = paymentToEdit.chapterId && paymentToEdit.chapterId[0] ? (paymentToEdit.chapterId[0].zoneId?._id || paymentToEdit.chapterId[0].zoneId) : "";
            setFormData({
                topic: paymentToEdit.topic,
                amount: paymentToEdit.amount,
                zoneId: selectedZoneId,
                chapters: selectedChapters,''')

with open('/Users/sanjaynaveen/Grip_admin/src/components/PaymentListLayer.jsx', 'w') as f:
    f.write(content)
