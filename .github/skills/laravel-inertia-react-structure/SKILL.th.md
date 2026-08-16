---
name: laravel-inertia-react-structure-th
user-invocable: false
description: แนวทางโครงสร้างฝั่ง Frontend สำหรับ Laravel Inertia React ตามแนวปฏิบัติระดับ production ใช้เมื่อสร้าง scaffold หรือรีวิวโค้ด frontend ในโปรเจกต์ Laravel Inertia React รวมถึงการจัดโครงสร้าง pages/modules/components การทำฟอร์ม การกำหนด type ของ props และการจัดการ state
---

# แนวทางโครงสร้าง Frontend สำหรับ Laravel Inertia React

เอกสารนี้ออกแบบเพื่อให้โค้ด frontend มีโครงสร้างที่ชัดเจน อ่านง่าย ขยายต่อได้ และดูแลรักษาได้ในระยะยาว

## หลักการสำคัญ

- หน้า page ควรเน้นการประกอบ UI และควบคุม flow เท่านั้น
- logic ที่ใช้ซ้ำหรือเกี่ยวกับโดเมนต้องอยู่ใน modules หรือ common
- สัญญาข้อมูลระหว่าง Laravel และ React ต้องชัดเจนด้วย TypeScript ที่ strict
- component แต่ละตัวควรรับผิดชอบงานเดียว

## Directory Structure

ใช้โครงสร้างหลักใน resources/js ดังนี้

resources/js/
- common/  : โค้ด generic ที่นำไปใช้ซ้ำได้ข้ามโปรเจกต์
- modules/ : โค้ดเฉพาะโดเมนหรือฟีเจอร์ของโปรเจกต์
- pages/   : Inertia page components
- shadcn/  : คอมโพเนนต์ auto-generated จาก shadcn/ui (ถ้าใช้งาน)

กฎตัดสินใจ
- ถ้าเป็นโค้ดที่ผูกกับโดเมน/ฟีเจอร์ ให้ไว้ที่ modules
- ถ้าเป็นโค้ด generic ไม่ผูกโดเมน ให้ไว้ที่ common

## Naming Conventions

- Components และ Contexts ใช้ PascalCase เช่น UserCard.tsx, AuthContext.tsx
- Hooks, Helpers, Constants, Stores ใช้ camelCase เช่น useAuth.ts, formatDate.ts
- Directory ใช้ kebab-case เช่น user-management/, date-picker/
- Inertia Page ควรลงท้ายด้วย Page เช่น IndexPage.tsx, EditPage.tsx

## Module Organization

โมดูลขนาดเล็กวางแบบเรียบได้ แต่โมดูลขนาดใหญ่ควรแยกตามประเภท เช่น

modules/orders/
- components/
- constants/
- helpers/
- hooks/
- stores/
- types.ts

หาก common โตขึ้น ให้ใช้รูปแบบเดียวกัน

## Pages Directory

- โครงสร้าง pages ควรสะท้อน URL
- partials ที่ใช้เฉพาะหน้านั้นควรอยู่ใกล้ไฟล์ Page
- layout แยกระดับ global และ section ได้ตามความเหมาะสม

## React Component Conventions

- ใช้ function declarations และ named exports
- หนึ่งไฟล์ต่อหนึ่ง component
- หลีกเลี่ยง barrel exports สำหรับ component
- จัด import เป็น 2 กลุ่ม
1) third-party/library imports
2) application imports (ใช้ alias path เช่น @/)

## Forms and Validation

- ต้องใช้ useForm ของ Inertia สำหรับส่งข้อมูลไป Laravel backend
- หลีกเลี่ยงการสร้าง form state เองด้วย useState ยกเว้นจำเป็นจริง
- แสดง backend validation errors ผ่าน errors object จาก useForm โดยตรง

## Type Safety for Inertia Props

- ทุก page component ต้องมี interface props แบบ strict ตามข้อมูลที่ controller ส่งมา
- shared model types เช่น User, Order ให้เก็บใน resources/js/types/index.ts หรือ types.ts ของแต่ละโมดูล
- ห้ามใช้ any หรือ unknown กับ page props

## State Management Rules

- ใช้ local useState เฉพาะ UI state ง่ายๆ เช่น เปิด/ปิด modal
- ใช้ URL parameters ผ่าน Inertia router สำหรับ filter, sort, pagination
- ใช้ Zustand ใน stores/ เฉพาะ state ที่ซับซ้อนและแชร์ข้ามหลายโมดูล

## Error Handling

- ไม่ต้องครอบ try/catch เองสำหรับการ submit form มาตรฐานของ Inertia
- ให้ใช้ callbacks ของ Inertia เช่น onSuccess และ onError เพื่อควบคุม flow

## Styles

- ใช้ Tailwind เป็นหลัก
- รวม utilities และ shared styles ที่ใช้ซ้ำไว้แบบมีศูนย์กลาง
- เลี่ยงการเขียน style ซ้ำกระจัดกระจาย

## Do/Don't Checklist สำหรับรีวิว PR ฝั่ง Frontend

### Do

- ตรวจว่าโครงสร้างหน้าใหม่สอดคล้อง URL และ pages directory
- ตรวจว่าฟอร์มใช้ useForm และแสดง backend errors ครบ
- ตรวจว่า Inertia page props มี type ชัดเจนและ strict
- ตรวจว่า logic ที่ใช้ซ้ำถูกแยกไป common หรือ modules แล้ว
- ตรวจว่าตำแหน่ง state ถูกต้อง (useState vs URL params vs Zustand)

### Don't

- อย่าใส่ logic โดเมนที่ใช้ซ้ำไว้ตรง page โดยตรง
- อย่าใช้ any กับ Inertia props
- อย่าใช้ custom form state ทั้งที่ useForm ตอบโจทย์อยู่แล้ว
- อย่าใช้ Zustand กับ state เล็กๆ เฉพาะ component
- อย่าส่ง payload ขนาดใหญ่เกินจำเป็นจาก backend มายัง frontend
