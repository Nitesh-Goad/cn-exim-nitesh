// // Copyright (c) 2025, Prathamesh Jadhav and contributors
// // For license information, please see license.txt

// frappe.ui.form.on("BOE Entry", {
//     refresh: function (frm) {
//         if (frm.doc.docstatus == 1) {
//             frm.add_custom_button("e-Waybill", function () {
//                 let items = []

//                 frappe.call({
//                     method: "cn_exim.cn_exim.doctype.boe_entry.boe_entry.get_items_details",
//                     args: {
//                         pre_alert_check_list: frm.doc.per_alert_check
//                     },
//                     callback: function (r) {
//                         let data = r.message[0]
//                         let parent_date = r.message[1]
//                         let total_amount = 0
//                         data.forEach(item => {
//                             items.push({
//                                 purchase_order: item.po_no,
//                                 item_code: item.item_code,
//                                 item_name: item.material_name,
//                                 qty: item.quantity,
//                                 po_qty: item.po_qty,
//                                 total_inr_value: item.total_amount,
//                                 rate: item.item_price,
//                                 amount: item.amount,
//                                 currency: parent_date[0]['currency'],
//                                 rate_inr: item.total_amount / item.quantity
//                             })
//                             total_amount += item.total_amount
//                         })
//                         frappe.call({
//                             method: "frappe.client.insert",
//                             args: {
//                                 doc: {
//                                     doctype: "E-way Bill",
//                                     select_doctype: frm.doctype,
//                                     doctype_id: frm.doc.name,
//                                     pre_alert_check_list: frm.doc.per_alert_check,
//                                     // total_amount: total_amount,
//                                     supplier: parent_date[0]['vendor'],
//                                     items: items
//                                 }
//                             },
//                             callback: function (r) {
//                                 frappe.set_route("Form", "E-way Bill", r.message['name'])
//                             }
//                         })
//                     }
//                 })
//             }, __("Create"))

//             frm.add_custom_button("Payment Entry", function(){
//                 let total_amount = frm.doc.bcd_amount + frm.doc.h_cess_amount + frm.doc.sws_amount + frm.doc.igst_amount;
//                 frappe.model.with_doctype("Payment Entry", function() {
//                     let doc = frappe.model.get_new_doc("Payment Entry");
                
//                     doc.custom_boe_entry = frm.doc.name;
//                     doc.payment_type = "Pay";
//                     doc.party_type = "Supplier";
//                     doc.paid_from = frm.doc.company;
//                     doc.paid_amount = total_amount;
//                     doc.currency = frm.doc.currency;
//                     doc.received_amount = total_amount;
                
//                     frappe.set_route("Form", "Payment Entry", doc.name);
                
//                     // Set party after route change to ensure party_type is applied
//                     frappe.after_ajax(() => {
//                         setTimeout(() => {
//                             locals["Payment Entry"][doc.name].party = frm.doc.vendor;
//                             frappe.model.set_value("Payment Entry", doc.name, "party", frm.doc.vendor);
//                         }, 300); // delay to allow party_type to process
//                     });
//                 });                
                
//             }, __("Create"))
//         }
//     }
// })


// Copyright (c) 2025, Prathamesh Jadhav and contributors
// For license information, please see license.txt

frappe.ui.form.on("BOE Entry", {
    refresh: function (frm) {
        if (frm.doc.docstatus == 1) {
            frm.add_custom_button("e-Waybill", function () {
                let items = []

                frappe.call({
                    method: "cn_exim.cn_exim.doctype.boe_entry.boe_entry.get_items_details",
                    args: {
                        pre_alert_check_list: frm.doc.per_alert_check
                    },
                    callback: function (r) {
                        let data = r.message[0]
                        let parent_date = r.message[1]
                        let total_amount = 0
                        data.forEach(item => {
                            items.push({
                                purchase_order: item.po_no,
                                item_code: item.item_code,
                                item_name: item.material_name,
                                qty: item.quantity,
                                po_qty: item.po_qty,
                                total_inr_value: item.total_amount,
                                rate: item.item_price,
                                amount: item.amount,
                                currency: parent_date[0]['currency'],
                                rate_inr: item.total_amount / item.quantity
                            })
                            total_amount += item.total_amount
                        })
                        frappe.call({
                            method: "frappe.client.insert",
                            args: {
                                doc: {
                                    doctype: "E-way Bill",
                                    select_doctype: frm.doctype,
                                    doctype_id: frm.doc.name,
                                    custom_boe_no: frm.doc.boe_no,
                                    custom_boe_date: frm.doc.boe_date,
                                    pre_alert_check_list: frm.doc.per_alert_check,
                                    // total_amount: total_amount,
                                    supplier: parent_date[0]['vendor'],
                                    items: items
                                }
                            },
                            callback: function (r) {
                                frappe.set_route("Form", "E-way Bill", r.message['name'])
                            }
                        })
                    }
                })
            }, __("Create"))

            frm.add_custom_button("Payment Entry", function(){
                let total_amount = frm.doc.bcd_amount + frm.doc.h_cess_amount + frm.doc.sws_amount + frm.doc.igst_amount;
                frappe.model.with_doctype("Payment Entry", function() {
                    let doc = frappe.model.get_new_doc("Payment Entry");
               
                    doc.custom_boe_entry = frm.doc.name;
                    doc.payment_type = "Pay";
                    doc.party_type = "Supplier";
                    doc.paid_from = frm.doc.company;
                    doc.paid_amount = total_amount;
                    doc.currency = frm.doc.currency;
                    doc.received_amount = total_amount;
               
                    frappe.set_route("Form", "Payment Entry", doc.name);
               
                    // Set party after route change to ensure party_type is applied
                    frappe.after_ajax(() => {
                        setTimeout(() => {
                            locals["Payment Entry"][doc.name].party = frm.doc.vendor;
                            frappe.model.set_value("Payment Entry", doc.name, "party", frm.doc.vendor);
                        }, 300); // delay to allow party_type to process
                    });
                });                
               
            }, __("Create"))

            frm.add_custom_button("PO Condition Change", function () {

                let items = [];

                // child table mapping from BOE
                if (frm.doc.boe_entries) {
                    frm.doc.boe_entries.forEach(row => {
                        items.push({
                            purchasing_doc: row.po_number,
                            order_quantity: row.total_qty,
                            amount: row.total_inr_value,
                            currency: frm.doc.currency,
                            vendor: frm.doc.vendor
                        });
                    });
                }

                // create new doc
                frappe.call({
                    method: "frappe.client.insert",
                    args: {
                        doc: {
                            doctype: "PO Condition Change",

                            // 🔹 HEADER FIELDS
                            boe_entry_reference: frm.doc.name,
                            boe_no: frm.doc.boe_no,
                            boe_date: frm.doc.boe_date,
                            pre_alert_req: frm.doc.per_alert_check,
                            pickup_req: frm.doc.pickup_request,
                            rfq_number: frm.doc.request_for_quotation,
                            vendor: frm.doc.vendor,
                            vendor_name: frm.doc.custom_vendor_name,
                            cha_vendor: frm.doc.cha,
                            cha_name: frm.doc.custom_cha_name,
                            exchange_rate: frm.doc.exchange_rate,

                            bcd_amt: frm.doc.bcd_amount,
                            h_cess_amt: frm.doc.h_cess_amount,
                            sws_amt: frm.doc.sws_amount,
                            igst_amt: frm.doc.igst_amount,
                            total_duty: frm.doc.total_duty,

                            freight_amt: frm.doc.total_freight,
                            other_chrg: frm.doc.other_charges,
                            total_inr_val: frm.doc.total_inr_value,
                            accessible_val: frm.doc.accessible_value,

                            check_list_date: frm.doc.check_list_date,
                            job_number: frm.doc.job_number,
                            ad_code: frm.doc.ad_code,
                            penalty: frm.doc.penalty,

                            // 🔹 CHILD TABLE
                            // po_condition_change_items: items,
                            // item_code: row.item_code,
                        }
                    },
                    callback: function (r) {
                        if (r.message) {
                            frappe.set_route("Form", "PO Condition Change", r.message.name);
                        }
                    }
                });

            }, __("Create"));
        }
    }
})