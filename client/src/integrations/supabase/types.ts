export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      company_id_result: {
        Row: {
          id: string | null
        }
        Insert: {
          id?: string | null
        }
        Update: {
          id?: string | null
        }
        Relationships: []
      }
      current: {
        Row: {
          id: string | null
          step_order: number | null
          step_padre: string | null
        }
        Insert: {
          id?: string | null
          step_order?: number | null
          step_padre?: string | null
        }
        Update: {
          id?: string | null
          step_order?: number | null
          step_padre?: string | null
        }
        Relationships: []
      }
      empresas_anticipos: {
        Row: {
          banco_origen: string | null
          comprobante: string | null
          comprobante_url: string | null
          creado_por: string | null
          created_at: string
          descripcion: string | null
          empresas_formulario_id: string
          estado: string
          fecha_pago: string | null
          id: string
          monto: number
          saldo: number | null
          updated_at: string
        }
        Insert: {
          banco_origen?: string | null
          comprobante?: string | null
          comprobante_url?: string | null
          creado_por?: string | null
          created_at?: string
          descripcion?: string | null
          empresas_formulario_id: string
          estado?: string
          fecha_pago?: string | null
          id?: string
          monto: number
          saldo?: number | null
          updated_at?: string
        }
        Update: {
          banco_origen?: string | null
          comprobante?: string | null
          comprobante_url?: string | null
          creado_por?: string | null
          created_at?: string
          descripcion?: string | null
          empresas_formulario_id?: string
          estado?: string
          fecha_pago?: string | null
          id?: string
          monto?: number
          saldo?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "empresas_anticipos_empresas_formulario_id_fkey"
            columns: ["empresas_formulario_id"]
            isOneToOne: false
            referencedRelation: "empresas_formulario"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "empresas_anticipos_empresas_formulario_id_fkey"
            columns: ["empresas_formulario_id"]
            isOneToOne: false
            referencedRelation: "v_empresas_formulario"
            referencedColumns: ["empresa_id"]
          },
        ]
      }
      empresas_bitacora: {
        Row: {
          acciones_solucion: string | null
          clave_cias: string | null
          clave_sri: string | null
          created_at: string | null
          dias_estado_actual: string | null
          duracion: string | null
          empresas_formulario_id: string
          especialista_asignado: string | null
          estado_actual: string | null
          estado_contacto: string | null
          estado_tramite: string | null
          fecha_sobre_entregado: string | null
          id: string
          link: string | null
          motivo: string | null
          nombre_asignado: string | null
          nombre_grupo: string | null
          num_tramite_sri: string | null
          punto_contacto: string | null
          saldo_pendiente: number | null
          sobre_entregado: string | null
          tags: string | null
          updated_at: string | null
          valor_tramite: number | null
        }
        Insert: {
          acciones_solucion?: string | null
          clave_cias?: string | null
          clave_sri?: string | null
          created_at?: string | null
          dias_estado_actual?: string | null
          duracion?: string | null
          empresas_formulario_id: string
          especialista_asignado?: string | null
          estado_actual?: string | null
          estado_contacto?: string | null
          estado_tramite?: string | null
          fecha_sobre_entregado?: string | null
          id?: string
          link?: string | null
          motivo?: string | null
          nombre_asignado?: string | null
          nombre_grupo?: string | null
          num_tramite_sri?: string | null
          punto_contacto?: string | null
          saldo_pendiente?: number | null
          sobre_entregado?: string | null
          tags?: string | null
          updated_at?: string | null
          valor_tramite?: number | null
        }
        Update: {
          acciones_solucion?: string | null
          clave_cias?: string | null
          clave_sri?: string | null
          created_at?: string | null
          dias_estado_actual?: string | null
          duracion?: string | null
          empresas_formulario_id?: string
          especialista_asignado?: string | null
          estado_actual?: string | null
          estado_contacto?: string | null
          estado_tramite?: string | null
          fecha_sobre_entregado?: string | null
          id?: string
          link?: string | null
          motivo?: string | null
          nombre_asignado?: string | null
          nombre_grupo?: string | null
          num_tramite_sri?: string | null
          punto_contacto?: string | null
          saldo_pendiente?: number | null
          sobre_entregado?: string | null
          tags?: string | null
          updated_at?: string | null
          valor_tramite?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "empresas_bitacora_empresa_id_fkey"
            columns: ["empresas_formulario_id"]
            isOneToOne: true
            referencedRelation: "empresas_formulario"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "empresas_bitacora_empresa_id_fkey"
            columns: ["empresas_formulario_id"]
            isOneToOne: true
            referencedRelation: "v_empresas_formulario"
            referencedColumns: ["empresa_id"]
          },
        ]
      }
      empresas_formulario: {
        Row: {
          actividad_economica: string | null
          acuerdo_metodo: number | null
          capital_inicial: number | null
          cedula_gerente: string | null
          cedulas: string | null
          ciudad_parroquia: string | null
          comprobante: string | null
          created_at: string | null
          direccion_exacta: string | null
          documento_direccion: string | null
          duracion_cargo_gerente: number | null
          email_accionista: string | null
          email_empresa: string | null
          fecha_fundacion: string | null
          firma_electronica: string | null
          gerente_es_accionista: string | null
          gerente_general: string | null
          id: string
          nombre_accionista: string | null
          nombre_comercial: string | null
          origen_contacto: string | null
          provincia_canton: string | null
          razon_social: string | null
          referencia_direccion: string | null
          respaldo_pago: string | null
          row_number: number | null
          submitted_at: string | null
          telefono_celular: number | null
          telefono_fijo: number | null
          token: string | null
          updated_at: string | null
          url_comprobante: string | null
          valoracion_formulario: number | null
        }
        Insert: {
          actividad_economica?: string | null
          acuerdo_metodo?: number | null
          capital_inicial?: number | null
          cedula_gerente?: string | null
          cedulas?: string | null
          ciudad_parroquia?: string | null
          comprobante?: string | null
          created_at?: string | null
          direccion_exacta?: string | null
          documento_direccion?: string | null
          duracion_cargo_gerente?: number | null
          email_accionista?: string | null
          email_empresa?: string | null
          fecha_fundacion?: string | null
          firma_electronica?: string | null
          gerente_es_accionista?: string | null
          gerente_general?: string | null
          id?: string
          nombre_accionista?: string | null
          nombre_comercial?: string | null
          origen_contacto?: string | null
          provincia_canton?: string | null
          razon_social?: string | null
          referencia_direccion?: string | null
          respaldo_pago?: string | null
          row_number?: number | null
          submitted_at?: string | null
          telefono_celular?: number | null
          telefono_fijo?: number | null
          token?: string | null
          updated_at?: string | null
          url_comprobante?: string | null
          valoracion_formulario?: number | null
        }
        Update: {
          actividad_economica?: string | null
          acuerdo_metodo?: number | null
          capital_inicial?: number | null
          cedula_gerente?: string | null
          cedulas?: string | null
          ciudad_parroquia?: string | null
          comprobante?: string | null
          created_at?: string | null
          direccion_exacta?: string | null
          documento_direccion?: string | null
          duracion_cargo_gerente?: number | null
          email_accionista?: string | null
          email_empresa?: string | null
          fecha_fundacion?: string | null
          firma_electronica?: string | null
          gerente_es_accionista?: string | null
          gerente_general?: string | null
          id?: string
          nombre_accionista?: string | null
          nombre_comercial?: string | null
          origen_contacto?: string | null
          provincia_canton?: string | null
          razon_social?: string | null
          referencia_direccion?: string | null
          respaldo_pago?: string | null
          row_number?: number | null
          submitted_at?: string | null
          telefono_celular?: number | null
          telefono_fijo?: number | null
          token?: string | null
          updated_at?: string | null
          url_comprobante?: string | null
          valoracion_formulario?: number | null
        }
        Relationships: []
      }
      empresas_observaciones: {
        Row: {
          created_at: string | null
          empresas_formulario_id: string
          especialista: string
          id: string
          observacion: string
          tipo: string | null
        }
        Insert: {
          created_at?: string | null
          empresas_formulario_id: string
          especialista: string
          id?: string
          observacion: string
          tipo?: string | null
        }
        Update: {
          created_at?: string | null
          empresas_formulario_id?: string
          especialista?: string
          id?: string
          observacion?: string
          tipo?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "empresas_observaciones_empresas_formulario_id_fkey"
            columns: ["empresas_formulario_id"]
            isOneToOne: false
            referencedRelation: "empresas_formulario"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "empresas_observaciones_empresas_formulario_id_fkey"
            columns: ["empresas_formulario_id"]
            isOneToOne: false
            referencedRelation: "v_empresas_formulario"
            referencedColumns: ["empresa_id"]
          },
        ]
      }
      especialistas: {
        Row: {
          id: string
          nombre: string
        }
        Insert: {
          id?: string
          nombre: string
        }
        Update: {
          id?: string
          nombre?: string
        }
        Relationships: []
      }
      item_membership: {
        Row: {
          created_at: string | null
          days: number | null
          days_grace: number | null
          discount: number | null
          end_date: string | null
          frequency_id: string | null
          id: string | null
          is_default: boolean | null
          membership_type_id: string | null
          number_users: number | null
          price: number | null
          price_final: number | null
          start_date: string | null
          state: boolean | null
          storage: string | null
          total_days: number | null
          update_at: string | null
        }
        Insert: {
          created_at?: string | null
          days?: number | null
          days_grace?: number | null
          discount?: number | null
          end_date?: string | null
          frequency_id?: string | null
          id?: string | null
          is_default?: boolean | null
          membership_type_id?: string | null
          number_users?: number | null
          price?: number | null
          price_final?: number | null
          start_date?: string | null
          state?: boolean | null
          storage?: string | null
          total_days?: number | null
          update_at?: string | null
        }
        Update: {
          created_at?: string | null
          days?: number | null
          days_grace?: number | null
          discount?: number | null
          end_date?: string | null
          frequency_id?: string | null
          id?: string | null
          is_default?: boolean | null
          membership_type_id?: string | null
          number_users?: number | null
          price?: number | null
          price_final?: number | null
          start_date?: string | null
          state?: boolean | null
          storage?: string | null
          total_days?: number | null
          update_at?: string | null
        }
        Relationships: []
      }
      item_step: {
        Row: {
          description: string | null
          detail: string | null
          status: string | null
          step_id: string | null
          step_order_padre: number | null
          step_padre: string | null
        }
        Insert: {
          description?: string | null
          detail?: string | null
          status?: string | null
          step_id?: string | null
          step_order_padre?: number | null
          step_padre?: string | null
        }
        Update: {
          description?: string | null
          detail?: string | null
          status?: string | null
          step_id?: string | null
          step_order_padre?: number | null
          step_padre?: string | null
        }
        Relationships: []
      }
      process_type: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          state: boolean | null
          title: string | null
          update_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          state?: boolean | null
          title?: string | null
          update_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          state?: boolean | null
          title?: string | null
          update_at?: string | null
        }
        Relationships: []
      }
      v_company_id: {
        Row: {
          id: string | null
        }
        Insert: {
          id?: string | null
        }
        Update: {
          id?: string | null
        }
        Relationships: []
      }
      v_person_id: {
        Row: {
          person_id: string | null
        }
        Insert: {
          person_id?: string | null
        }
        Update: {
          person_id?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      company_electronic_signature: {
        Row: {
          company_id: string | null
          created_at: string | null
          id: string | null
          p12: string | null
          password: string | null
          state: boolean | null
          update_at: string | null
        }
        Insert: {
          company_id?: string | null
          created_at?: string | null
          id?: string | null
          p12?: string | null
          password?: string | null
          state?: boolean | null
          update_at?: string | null
        }
        Update: {
          company_id?: string | null
          created_at?: string | null
          id?: string | null
          p12?: string | null
          password?: string | null
          state?: boolean | null
          update_at?: string | null
        }
        Relationships: []
      }
      company_prompt: {
        Row: {
          attention_rules: string | null
          body: string | null
          company_id: string | null
          created_at: string | null
          example: string | null
          frequently_question: string | null
          id: string | null
          id_workflow: string | null
          name: string | null
          objective: string | null
          restriction: string | null
          routing_workflow: string | null
          state: boolean | null
          type: string | null
          update_at: string | null
        }
        Insert: {
          attention_rules?: string | null
          body?: string | null
          company_id?: string | null
          created_at?: string | null
          example?: string | null
          frequently_question?: string | null
          id?: string | null
          id_workflow?: string | null
          name?: string | null
          objective?: string | null
          restriction?: string | null
          routing_workflow?: string | null
          state?: boolean | null
          type?: string | null
          update_at?: string | null
        }
        Update: {
          attention_rules?: string | null
          body?: string | null
          company_id?: string | null
          created_at?: string | null
          example?: string | null
          frequently_question?: string | null
          id?: string | null
          id_workflow?: string | null
          name?: string | null
          objective?: string | null
          restriction?: string | null
          routing_workflow?: string | null
          state?: boolean | null
          type?: string | null
          update_at?: string | null
        }
        Relationships: []
      }
      data_company: {
        Row: {
          address: string | null
          business_name: string | null
          canton: string | null
          city: string | null
          code_id: string | null
          company_id: string | null
          company_mail: string | null
          company_phone: string | null
          company_website: string | null
          document_id: string | null
          email: string | null
          google_maps: string | null
          lastname: string | null
          logo: string | null
          name: string | null
          nationality: string | null
          person_id: string | null
          province: string | null
          ruc: string | null
          schedule: string | null
          secretary_alias: string | null
          secretary_genero: string | null
          service: string | null
          state_company: boolean | null
          type: string | null
          type_document_id: string | null
          update_at: string | null
          website: string | null
        }
        Relationships: []
      }
      get_membership_agent: {
        Row: {
          countries: Json | null
          description: string | null
          frequencies: Json | null
          image: string | null
          limit_process: number | null
          membership_type_id: string | null
          membership_type_is_default: boolean | null
          membership_type_name: string | null
          membership_type_state: boolean | null
          number_users: number | null
          process: Json | null
          storage: string | null
          system_id: string | null
          tutorial: string | null
        }
        Relationships: []
      }
      get_membership_for_activate: {
        Row: {
          country_id: string | null
          created_at: string | null
          days: number | null
          days_grace: number | null
          discount: number | null
          end_date: string | null
          frequency_id: string | null
          frequency_state: boolean | null
          id: string | null
          is_default: boolean | null
          membership_id: string | null
          membership_state: boolean | null
          membership_type_country_state: boolean | null
          membership_type_id: string | null
          membership_type_state: boolean | null
          number_users: number | null
          price: number | null
          price_final: number | null
          start_date: string | null
          state: boolean | null
          storage: string | null
          total_days: number | null
          type: string | null
          update_at: string | null
        }
        Relationships: []
      }
      get_membership_system: {
        Row: {
          active_countries: Json | null
          limit_process: number | null
          membership_info: Json | null
          membership_type_id: string | null
          membership_type_is_default: boolean | null
          membership_type_name: string | null
          membership_type_state: boolean | null
          number_users: number | null
          storage: string | null
          system_id: string | null
        }
        Relationships: []
      }
      get_membership_type: {
        Row: {
          active_countries: Json | null
          limit_process: number | null
          membership_info: Json | null
          membership_type_id: string | null
          membership_type_is_default: boolean | null
          membership_type_name: string | null
          membership_type_state: boolean | null
          number_users: number | null
          storage: string | null
          system_id: string | null
        }
        Relationships: []
      }
      get_properties_requirement: {
        Row: {
          code_id: number | null
          created_at: string | null
          description: string | null
          document: Json | null
          id: string | null
          name: string | null
          state: boolean | null
          update_at: string | null
        }
        Relationships: []
      }
      get_requirement_process: {
        Row: {
          alias: string | null
          code_id: number | null
          process_type_id: string | null
          requirement: Json | null
        }
        Relationships: []
      }
      products_by_company: {
        Row: {
          benefits: string[] | null
          category: string | null
          common_objections: string[] | null
          company_id: string | null
          created_at: string | null
          currency: string | null
          description: string | null
          duration: string | null
          id: string | null
          is_available: boolean | null
          name: string | null
          price: number | null
          pricing_rules: Json | null
          provision_flow: string[] | null
          rating: string | null
          stock: number | null
          success_cases: string | null
          type: string | null
          updated_at: string | null
        }
        Relationships: []
      }
      user_with_person: {
        Row: {
          address: string | null
          attempts: number | null
          birth_date: string | null
          blocked: boolean | null
          business_name: string | null
          company_id: string | null
          country_id: string | null
          created_at: string | null
          document_id: string | null
          email: string | null
          id: string | null
          lastname: string | null
          membership_company_id: string | null
          membership_id: string | null
          name: string | null
          nationality: string | null
          other_profession: string | null
          password: string | null
          phone: string | null
          profession: string | null
          rol: string | null
          state: boolean | null
          system_id: string | null
          temporary_key: boolean | null
          type_document_id: string | null
          update_at: string | null
          user_id: string | null
          user_state: boolean | null
          username: string | null
        }
        Relationships: []
      }
      v_agent_faq: {
        Row: {
          asistente: string | null
          chesca: string | null
          created_at: string | null
          id: string | null
          manu: string | null
          mila: string | null
          nacho: string | null
          state: boolean | null
          system_id: string | null
          update_at: string | null
        }
        Insert: {
          asistente?: string | null
          chesca?: string | null
          created_at?: string | null
          id?: string | null
          manu?: string | null
          mila?: string | null
          nacho?: string | null
          state?: boolean | null
          system_id?: string | null
          update_at?: string | null
        }
        Update: {
          asistente?: string | null
          chesca?: string | null
          created_at?: string | null
          id?: string | null
          manu?: string | null
          mila?: string | null
          nacho?: string | null
          state?: boolean | null
          system_id?: string | null
          update_at?: string | null
        }
        Relationships: []
      }
      v_client_complaints: {
        Row: {
          assigned_agent: string | null
          complaint_type: string | null
          created_at: string | null
          description: string | null
          id: string | null
          lead_id: string | null
          priority: string | null
          resolution: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          assigned_agent?: string | null
          complaint_type?: string | null
          created_at?: string | null
          description?: string | null
          id?: string | null
          lead_id?: string | null
          priority?: string | null
          resolution?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          assigned_agent?: string | null
          complaint_type?: string | null
          created_at?: string | null
          description?: string | null
          id?: string | null
          lead_id?: string | null
          priority?: string | null
          resolution?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      v_company_booking: {
        Row: {
          company_data: Json | null
          company_id: string | null
        }
        Relationships: []
      }
      v_company_detaill: {
        Row: {
          business_name: string | null
          chatrace_id: string | null
          code_id: string | null
          company_profile: Json | null
          data_sheet_n8n: string | null
          id: string | null
          no_company: string | null
          person_id: string | null
          ruc: string | null
          type: string | null
          update_at: string | null
        }
        Relationships: []
      }
      v_company_type: {
        Row: {
          applies_apb: boolean | null
          applies_date: boolean | null
          applies_products: boolean | null
          applies_room: boolean | null
          applies_table: boolean | null
          calendly_required: boolean | null
          category: string | null
          id: string | null
          scope: string | null
          service_type: string | null
          status: boolean | null
          type: string | null
        }
        Insert: {
          applies_apb?: boolean | null
          applies_date?: boolean | null
          applies_products?: boolean | null
          applies_room?: boolean | null
          applies_table?: boolean | null
          calendly_required?: boolean | null
          category?: string | null
          id?: string | null
          scope?: string | null
          service_type?: string | null
          status?: boolean | null
          type?: string | null
        }
        Update: {
          applies_apb?: boolean | null
          applies_date?: boolean | null
          applies_products?: boolean | null
          applies_room?: boolean | null
          applies_table?: boolean | null
          calendly_required?: boolean | null
          category?: string | null
          id?: string | null
          scope?: string | null
          service_type?: string | null
          status?: boolean | null
          type?: string | null
        }
        Relationships: []
      }
      v_empresas_formulario: {
        Row: {
          actividad_economica: string | null
          acuerdo_metodo: number | null
          capital_inicial: number | null
          cedula_gerente: string | null
          cedulas: string | null
          ciudad_parroquia: string | null
          comprobante: string | null
          direccion_exacta: string | null
          documento_direccion: string | null
          duracion_cargo_gerente: number | null
          email_accionista: string | null
          email_empresa: string | null
          empresa_created_at: string | null
          empresa_id: string | null
          empresa_updated_at: string | null
          empresas_bitacora: Json | null
          fecha_fundacion: string | null
          firma_electronica: string | null
          gerente_es_accionista: string | null
          gerente_general: string | null
          nombre_accionista: string | null
          nombre_comercial: string | null
          origen_contacto: string | null
          provincia_canton: string | null
          razon_social: string | null
          referencia_direccion: string | null
          respaldo_pago: string | null
          row_number: number | null
          submitted_at: string | null
          telefono_celular: number | null
          telefono_fijo: number | null
          token: string | null
          url_comprobante: string | null
          valoracion_formulario: number | null
        }
        Relationships: []
      }
      v_membership_type: {
        Row: {
          country: string | null
          country_id: string | null
          days: number | null
          days_grace: number | null
          discount: number | null
          end_date: string | null
          frequency: string | null
          frequency_id: string | null
          is_default: boolean | null
          membership_id: string | null
          membership_type: string | null
          membership_type_id: string | null
          membership_type_name: string | null
          number_users: number | null
          price: number | null
          price_final: number | null
          start_date: string | null
          state: boolean | null
          storage: string | null
          system_id: string | null
          total_days: number | null
        }
        Relationships: []
      }
      v_name_user: {
        Row: {
          address: string | null
          attempts: number | null
          birth_date: string | null
          blocked: boolean | null
          business_name: string | null
          country_id: string | null
          created_at: string | null
          document_id: string | null
          email: string | null
          id: string | null
          lastname: string | null
          name: string | null
          name_user: string | null
          nationality: string | null
          password: string | null
          phone: string | null
          rol: string | null
          state: boolean | null
          temporary_key: boolean | null
          type_document_id: string | null
          update_at: string | null
          user_id: string | null
          user_state: boolean | null
          username: string | null
        }
        Relationships: []
      }
      v_process_client: {
        Row: {
          address: string | null
          assistant: string | null
          code_id: number | null
          created_at: string | null
          document_id: string | null
          email: string | null
          id: string | null
          name: string | null
          phone: string | null
          process_id: string | null
          process_status: string | null
          process_title: string | null
        }
        Relationships: []
      }
      v_process_info: {
        Row: {
          assistant: string | null
          client_address: string | null
          client_document: string | null
          client_email: string | null
          client_id: string | null
          client_name: string | null
          client_phone: string | null
          client_process_created_at: string | null
          client_process_status: string | null
          client_process_updated_at: string | null
          code_id: number | null
          company_id: string | null
          current_step: string | null
          current_step_description: string | null
          current_substep: string | null
          current_substep_description: string | null
          finalized: boolean | null
          folder_id: string | null
          process_created_at: string | null
          process_id: string | null
          process_type_id: string | null
          process_type_image: string | null
          process_type_name: string | null
          process_type_state: boolean | null
          process_type_tutorial: string | null
          process_update_at: string | null
          requirement_approved: number | null
          requirement_count: number | null
          tutorial_type: string | null
          user_id: string | null
          with_tutorial: boolean | null
        }
        Relationships: []
      }
      v_process_step_resources: {
        Row: {
          created_at: string | null
          description: string | null
          document: string | null
          image: string | null
          link_id: string | null
          name: string | null
          process_type_step_id: string | null
          resource_id: string | null
          state: boolean | null
          type: string | null
          update_at: string | null
          url: string | null
        }
        Relationships: []
      }
      v_process_type: {
        Row: {
          alias: string | null
          created_at: string | null
          id: string | null
          image: string | null
          name: string | null
          process_type_id: string | null
          state: boolean | null
          tutorial: string | null
          update_at: string | null
        }
        Insert: {
          alias?: string | null
          created_at?: string | null
          id?: string | null
          image?: string | null
          name?: string | null
          process_type_id?: string | null
          state?: boolean | null
          tutorial?: string | null
          update_at?: string | null
        }
        Update: {
          alias?: string | null
          created_at?: string | null
          id?: string | null
          image?: string | null
          name?: string | null
          process_type_id?: string | null
          state?: boolean | null
          tutorial?: string | null
          update_at?: string | null
        }
        Relationships: []
      }
      v_process_type_doc: {
        Row: {
          alias: string | null
          created_at: string | null
          description: string | null
          document: string | null
          image: string | null
          link_id: string | null
          name: string | null
          process_type_id: string | null
          resource_id: string | null
          resource_name: string | null
          state: boolean | null
          step_id: string | null
          tutorial: string | null
          type: string | null
          update_at: string | null
          url: string | null
        }
        Relationships: []
      }
      v_product_pricing_rules: {
        Row: {
          created_at: string | null
          id: string | null
          max_value: number | null
          min_value: number | null
          notes: string | null
          price_per_unit: number | null
          product_id: string | null
          rule_type: string | null
          total_price: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string | null
          max_value?: number | null
          min_value?: number | null
          notes?: string | null
          price_per_unit?: number | null
          product_id?: string | null
          rule_type?: string | null
          total_price?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string | null
          max_value?: number | null
          min_value?: number | null
          notes?: string | null
          price_per_unit?: number | null
          product_id?: string | null
          rule_type?: string | null
          total_price?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      v_qualified_lead_audit_log: {
        Row: {
          agent_id: string | null
          change_type: string | null
          channel: string | null
          created_at: string | null
          id: string | null
          lead_id: string | null
          name_user: string | null
          new_value: Json | null
          notes: string | null
          old_value: Json | null
          user_id: string | null
        }
        Relationships: []
      }
      v_qualified_lead_notes: {
        Row: {
          agent_id: string | null
          content: string | null
          created_at: string | null
          id: string | null
          lead_id: string | null
          metadata: Json | null
          note_type: string | null
          source: string | null
          user_id: string | null
        }
        Insert: {
          agent_id?: string | null
          content?: string | null
          created_at?: string | null
          id?: string | null
          lead_id?: string | null
          metadata?: Json | null
          note_type?: string | null
          source?: string | null
          user_id?: string | null
        }
        Update: {
          agent_id?: string | null
          content?: string | null
          created_at?: string | null
          id?: string | null
          lead_id?: string | null
          metadata?: Json | null
          note_type?: string | null
          source?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      v_qualified_leads: {
        Row: {
          agent_id: string | null
          channel: string | null
          client_email: string | null
          client_id_number: string | null
          client_name: string | null
          client_phone: string | null
          company_id: string | null
          complaints: Json | null
          contact_attempts: number | null
          created_at: string | null
          feedbacks: Json | null
          id: string | null
          interest_level: string | null
          last_channel: string | null
          last_contact_at: string | null
          lead_status: string | null
          mode: string | null
          next_followup_at: string | null
          notes: string | null
          qualification_result: string | null
          service_id: string | null
          system_id: string | null
          updated_agent: string | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          agent_id?: string | null
          channel?: string | null
          client_email?: string | null
          client_id_number?: string | null
          client_name?: string | null
          client_phone?: string | null
          company_id?: string | null
          complaints?: never
          contact_attempts?: number | null
          created_at?: string | null
          feedbacks?: never
          id?: string | null
          interest_level?: string | null
          last_channel?: string | null
          last_contact_at?: string | null
          lead_status?: string | null
          mode?: string | null
          next_followup_at?: string | null
          notes?: string | null
          qualification_result?: string | null
          service_id?: string | null
          system_id?: string | null
          updated_agent?: string | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          agent_id?: string | null
          channel?: string | null
          client_email?: string | null
          client_id_number?: string | null
          client_name?: string | null
          client_phone?: string | null
          company_id?: string | null
          complaints?: never
          contact_attempts?: number | null
          created_at?: string | null
          feedbacks?: never
          id?: string | null
          interest_level?: string | null
          last_channel?: string | null
          last_contact_at?: string | null
          lead_status?: string | null
          mode?: string | null
          next_followup_at?: string | null
          notes?: string | null
          qualification_result?: string | null
          service_id?: string | null
          system_id?: string | null
          updated_agent?: string | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: []
      }
      v_requirement: {
        Row: {
          created_at: string | null
          description: string | null
          document: Json | null
          id: string | null
          name: string | null
          state: boolean | null
          type: string | null
          update_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          document?: Json | null
          id?: string | null
          name?: string | null
          state?: boolean | null
          type?: string | null
          update_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          document?: Json | null
          id?: string | null
          name?: string | null
          state?: boolean | null
          type?: string | null
          update_at?: string | null
        }
        Relationships: []
      }
      v_reservation_settings: {
        Row: {
          close_time: string | null
          company_id: string | null
          created_at: string | null
          days_open: string[] | null
          id: string | null
          is_active: boolean | null
          max_reservations_per_day: number | null
          max_reservations_per_hour: number | null
          menu_url: string | null
          open_time: string | null
          payment_url: string | null
          suspend_message: string | null
          updated_at: string | null
        }
        Insert: {
          close_time?: string | null
          company_id?: string | null
          created_at?: string | null
          days_open?: string[] | null
          id?: string | null
          is_active?: boolean | null
          max_reservations_per_day?: number | null
          max_reservations_per_hour?: number | null
          menu_url?: string | null
          open_time?: string | null
          payment_url?: string | null
          suspend_message?: string | null
          updated_at?: string | null
        }
        Update: {
          close_time?: string | null
          company_id?: string | null
          created_at?: string | null
          days_open?: string[] | null
          id?: string | null
          is_active?: boolean | null
          max_reservations_per_day?: number | null
          max_reservations_per_hour?: number | null
          menu_url?: string | null
          open_time?: string | null
          payment_url?: string | null
          suspend_message?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      v_service_feedback_campaigns: {
        Row: {
          active: boolean | null
          company_id: string | null
          created_at: string | null
          description: string | null
          end_date: string | null
          id: string | null
          name: string | null
          start_date: string | null
          updated_at: string | null
        }
        Insert: {
          active?: boolean | null
          company_id?: string | null
          created_at?: string | null
          description?: string | null
          end_date?: string | null
          id?: string | null
          name?: string | null
          start_date?: string | null
          updated_at?: string | null
        }
        Update: {
          active?: boolean | null
          company_id?: string | null
          created_at?: string | null
          description?: string | null
          end_date?: string | null
          id?: string | null
          name?: string | null
          start_date?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      v_service_feedback_responses: {
        Row: {
          campaign_id: string | null
          channel: string | null
          comment: string | null
          created_at: string | null
          id: string | null
          lead_id: string | null
          rating: number | null
          updated_at: string | null
        }
        Insert: {
          campaign_id?: string | null
          channel?: string | null
          comment?: string | null
          created_at?: string | null
          id?: string | null
          lead_id?: string | null
          rating?: number | null
          updated_at?: string | null
        }
        Update: {
          campaign_id?: string | null
          channel?: string | null
          comment?: string | null
          created_at?: string | null
          id?: string | null
          lead_id?: string | null
          rating?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      v_steps_info: {
        Row: {
          approve: boolean | null
          created_at: string | null
          description: string | null
          export_file: boolean | null
          files: boolean | null
          id: string | null
          image: string | null
          label_status: string | null
          label_step_padre: string | null
          make_file: boolean | null
          name: string | null
          requirements: boolean | null
          state: boolean | null
          status_id: string | null
          step_order: number | null
          step_order_padre: number | null
          step_padre: string | null
          update: boolean | null
          update_at: string | null
          webhook_url: string | null
        }
        Relationships: []
      }
      v_steps_process_info: {
        Row: {
          approve: boolean | null
          created_at: string | null
          description: string | null
          export_file: boolean | null
          files: boolean | null
          id: string | null
          image: string | null
          label_status: string | null
          label_step_padre: string | null
          make_file: boolean | null
          name: string | null
          process_type_id: string | null
          process_type_step_id: string | null
          requirements: boolean | null
          state: boolean | null
          status_id: string | null
          step_order: number | null
          step_order_padre: number | null
          step_padre: string | null
          update: boolean | null
          update_at: string | null
          webhook_url: string | null
        }
        Relationships: []
      }
      v_system: {
        Row: {
          created_at: string | null
          descripcion: string | null
          id: string | null
          name: string | null
          state: boolean | null
          update_at: string | null
        }
        Insert: {
          created_at?: string | null
          descripcion?: string | null
          id?: string | null
          name?: string | null
          state?: boolean | null
          update_at?: string | null
        }
        Update: {
          created_at?: string | null
          descripcion?: string | null
          id?: string | null
          name?: string | null
          state?: boolean | null
          update_at?: string | null
        }
        Relationships: []
      }
      view_company_prompt: {
        Row: {
          aboutus: string | null
          attention_rules: string | null
          body: string | null
          company_id: string | null
          contact: string | null
          created_at: string | null
          frequently_question: string | null
          id: string | null
          id_workflow: string | null
          name: string | null
          objective: string | null
          restriction: string | null
          routing_workflow: string | null
          state: boolean | null
          type: string | null
          update_at: string | null
        }
        Insert: {
          aboutus?: string | null
          attention_rules?: string | null
          body?: string | null
          company_id?: string | null
          contact?: string | null
          created_at?: string | null
          frequently_question?: string | null
          id?: string | null
          id_workflow?: string | null
          name?: string | null
          objective?: string | null
          restriction?: string | null
          routing_workflow?: string | null
          state?: boolean | null
          type?: string | null
          update_at?: string | null
        }
        Update: {
          aboutus?: string | null
          attention_rules?: string | null
          body?: string | null
          company_id?: string | null
          contact?: string | null
          created_at?: string | null
          frequently_question?: string | null
          id?: string | null
          id_workflow?: string | null
          name?: string | null
          objective?: string | null
          restriction?: string | null
          routing_workflow?: string | null
          state?: boolean | null
          type?: string | null
          update_at?: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      approve_file_requeriment: { Args: { json_data: Json }; Returns: Json }
      assign_steps_to_process_type: {
        Args: { process_type_id_param: string; step_ids: string[] }
        Returns: Json
      }
      bulk_assign_steps_to_process_type: {
        Args: { process_type_id_param: string; step_assignments: Json }
        Returns: Json
      }
      change_user_password: {
        Args: {
          current_password_param: string
          new_password_param: string
          user_id_param: string
        }
        Returns: Json
      }
      create_company_client: { Args: { json_data: Json }; Returns: Json }
      delete_agent_file: { Args: { file_id_param: string }; Returns: Json }
      delete_agent_membership: {
        Args: { membership_process_id_param: string }
        Returns: Json
      }
      delete_agent_process_type: {
        Args: { process_type_id_param: string }
        Returns: Json
      }
      delete_agent_requirement: {
        Args: { requirement_id_param: string }
        Returns: Json
      }
      delete_agent_step: { Args: { step_id_param: string }; Returns: Json }
      delete_company_client: {
        Args: { client_id_param: string }
        Returns: Json
      }
      delete_company_payment_method: {
        Args: { payment_method_id_param: string }
        Returns: Json
      }
      delete_company_prompt: {
        Args: { company_id_param: string; prompt_id_param: string }
        Returns: Json
      }
      delete_company_user: {
        Args: { current_user_id_param: string; user_id_param: string }
        Returns: Json
      }
      delete_membership_type: {
        Args: { membership_type_id_param: string }
        Returns: Json
      }
      delete_notification_template: {
        Args: { template_id_param: string }
        Returns: Json
      }
      delete_process_type_step: {
        Args: { assignment_id_param: string }
        Returns: Json
      }
      delete_process_type_step_resource: {
        Args: { p_link_id: string }
        Returns: boolean
      }
      get_agent_files: {
        Args: never
        Returns: {
          created_at: string
          document: string
          id: string
          name: string
          state: boolean
          update_at: string
          variables: string
        }[]
      }
      get_agent_process_types:
        | {
            Args: never
            Returns: {
              alias: string
              created_at: string
              id: string
              image: string
              name: string
              process_type_id: string
              state: boolean
              tutorial: string
              update_at: string
            }[]
          }
        | {
            Args: { company_id_param: string }
            Returns: {
              id: string
              name: string
              state: boolean
            }[]
          }
      get_agent_requirements: {
        Args: never
        Returns: {
          created_at: string
          description: string
          document: Json
          id: string
          name: string
          state: boolean
          type: string
          update_at: string
        }[]
      }
      get_agent_status: {
        Args: never
        Returns: {
          created_at: string
          id: string
          name: string
          update_at: string
        }[]
      }
      get_agent_steps: {
        Args: never
        Returns: {
          created_at: string
          description: string
          id: string
          name: string
          state: boolean
          status_id: string
          status_name: string
          step_order: number
          step_padre: string
          update_at: string
        }[]
      }
      get_agent_steps_by_process_type: {
        Args: { process_type_id_param: string }
        Returns: {
          created_at: string
          description: string
          id: string
          name: string
          process_type_id: string
          state: boolean
          status_id: string
          status_name: string
          step_order: number
          step_padre: string
          update_at: string
        }[]
      }
      get_all_resources: {
        Args: never
        Returns: {
          created_at: string
          description: string
          document: string
          id: string
          image: string
          name: string
          state: boolean
          type: string
          update_at: string
          url: string
        }[]
      }
      get_catalogs: { Args: never; Returns: Json }
      get_company_clients: {
        Args: { company_id_param: string }
        Returns: {
          address: string
          assistant: string
          created_at: string
          document_id: string
          email: string
          id: string
          name: string
          phone: string
          process_status: string
          process_title: string
        }[]
      }
      get_company_invoices: {
        Args: { company_id_param: string }
        Returns: {
          auth_number: string
          created_at: string
          currency_code: string
          discount_amount: number
          id: string
          invoice_date: string
          invoice_number: string
          iva: number
          iva_amount: number
          observations: string
          person_id: string
          status: string
          subtotal: number
          total_amount: number
        }[]
      }
      get_company_payment_methods: {
        Args: { user_id_param: string }
        Returns: {
          account_holder_name: string
          account_number: string
          bank: string
          company_id: string
          created_at: string
          document_id: string
          email: string
          exp_month: string
          exp_year: string
          id: string
          is_collection: boolean
          is_default: boolean
          sequence: string
          state: boolean
          store_id: string
          token: string
          type: string
          updated_at: string
        }[]
      }
      get_company_questions: {
        Args: { user_id_param: string }
        Returns: {
          answer: string
          company_id: string
          created_at: string
          id: string
          question: string
          state: boolean
          update_at: string
        }[]
      }
      get_company_users: {
        Args: { user_id_param: string }
        Returns: {
          created_at: string
          email: string
          lastname: string
          name: string
          phone: string
          rol: string
          user_id: string
          user_state: boolean
        }[]
      }
      get_current_step: { Args: { json_data: Json }; Returns: Json }
      get_current_user_company_id: {
        Args: { user_id_param: string }
        Returns: string
      }
      get_data_tramite: { Args: { p_process_type_id: string }; Returns: Json }
      get_info_company_meta: {
        Args: { client: string }
        Returns: {
          access_token: string
          business_id: string
          business_name: string
          client_id: string
          client_secret: string
          company_id: string
          open_ia: string
          permanent_token: string
          phone_number: string
        }[]
      }
      get_info_email: {
        Args: { template: string }
        Returns: {
          body: string
          subject: string
          variables: Json
        }[]
      }
      get_invoice_items: {
        Args: { invoice_id_param: string }
        Returns: {
          description: string
          discount_amount: number
          id: string
          quantity: number
          subtotal: number
          unit_price: number
        }[]
      }
      get_next_step_by_process: {
        Args: {
          p_current_step: number
          p_current_step_padre: number
          p_process_type_id: string
        }
        Returns: Json
      }
      get_notification_templates: {
        Args: never
        Returns: {
          body: string
          created_at: string
          id: string
          name: string
          state: boolean
          subject: string
          type: string
          update_at: string
          variables: Json
        }[]
      }
      get_process_files_by_process_id: {
        Args: { process_id_param: string }
        Returns: {
          created_at: string
          file_data: string
          file_document: string
          file_id: string
          file_id_fk: string
          file_name: string
          file_type: string
          state: string
          update_at: string
        }[]
      }
      get_process_resources: {
        Args: { p_process_type_id: string }
        Returns: {
          created_at: string
          description: string
          document: string
          image: string
          link_id: string
          name: string
          process_type_id: string
          resource_id: string
          state: boolean
          step_id: string
          type: string
          update_at: string
          url: string
        }[]
      }
      get_process_step_details: {
        Args: { process_id_param: string }
        Returns: {
          created_at: string
          detail: string
          files: boolean
          step_description: string
          step_id: string
          step_name: string
          updated_at: string
        }[]
      }
      get_process_step_resources: {
        Args: { p_process_type_step_id: string }
        Returns: {
          created_at: string
          description: string
          document: string
          image: string
          link_id: string
          name: string
          process_type_step_id: string
          resource_id: string
          state: boolean
          type: string
          update_at: string
          url: string
        }[]
      }
      get_process_steps_status: {
        Args: { process_id_param: string }
        Returns: Json
      }
      get_process_type_files: {
        Args: { process_type_id_param: string }
        Returns: {
          file_document: string
          file_id: string
          file_name: string
          file_variables: string
          state: boolean
        }[]
      }
      get_process_type_step_assignments: {
        Args: { process_type_id_param?: string }
        Returns: {
          created_at: string
          id: string
          process_type_id: string
          status_name: string
          step_description: string
          step_id: string
          step_name: string
          step_order: number
          update_at: string
        }[]
      }
      get_process_type_step_requirements: {
        Args: { process_type_step_id_param: string }
        Returns: {
          requirement_description: string
          requirement_id: string
          requirement_name: string
          state: boolean
        }[]
      }
      get_process_type_steps: {
        Args: { process_type_id_param: string }
        Returns: {
          assigned: boolean
          status_id: string
          status_name: string
          step_description: string
          step_id: string
          step_name: string
          step_order: number
          step_state: boolean
        }[]
      }
      get_profile_completion_percentage: {
        Args: { user_id_param: string }
        Returns: number
      }
      get_requirements: {
        Args: { code_id: string; process: string }
        Returns: {
          process_type: string
          process_type_id: string
          requirement: Json
          step: string
        }[]
      }
      get_step_files: {
        Args: { process_id_param: string }
        Returns: {
          created_at: string
          data: string
          document: string
          file_id: string
          folder_id: string
          id: string
          link: string
          mime_type: string
          name: string
          preview: string
          process_id: string
          state: string
          type: string
          update_at: string
        }[]
      }
      get_step_requirements: {
        Args: { step_id_param: string }
        Returns: {
          requirement_description: string
          requirement_id: string
          requirement_name: string
          state: boolean
        }[]
      }
      get_user_role: { Args: { user_id_param: string }; Returns: string }
      init_tramite_chatbot: { Args: { json_data: Json }; Returns: Json }
      insert_company: {
        Args: {
          p_canton?: string
          p_city?: string
          p_code_id?: string
          p_logo?: string
          p_person_id: string
          p_province?: string
          p_ruc?: string
          p_schedule?: string
          p_service?: string
          p_type?: string
          p_website?: string
          point_of_issue?: string
          remission_guide?: string
        }
        Returns: string
      }
      insert_payment_record: { Args: { json_data: Json }; Returns: Json }
      new_user: { Args: { json_data: Json }; Returns: Json }
      new_user_step_1: { Args: { json_data: Json }; Returns: Json }
      new_user_step_2: { Args: { json_data: Json }; Returns: Json }
      new_user_step_3: { Args: { json_data: Json }; Returns: Json }
      next_status_step: { Args: { json_data: Json }; Returns: Json }
      obtener_catalogos: { Args: never; Returns: Json }
      safe_text_to_uuid: { Args: { input_text: string }; Returns: string }
      save_file_data_ec: { Args: { json_data: Json }; Returns: Json }
      save_file_requeriment: { Args: { json_data: Json }; Returns: Json }
      sumar_dias_a_hoy: { Args: { dias: number }; Returns: string }
      update_company_client: {
        Args: { client_id_param: string; json_data: Json }
        Returns: Json
      }
      update_process_client: { Args: { json_data: Json }; Returns: Json }
      update_profile_data: {
        Args: { company_data: Json; questions_data?: Json; user_data: Json }
        Returns: Json
      }
      upsert_agent_faq: { Args: { data: Json }; Returns: Json }
      upsert_agent_file: { Args: { json_data: Json }; Returns: Json }
      upsert_agent_process_type: { Args: { json_data: Json }; Returns: Json }
      upsert_agent_requirement: { Args: { json_data: Json }; Returns: Json }
      upsert_agent_step: { Args: { json_data: Json }; Returns: Json }
      upsert_client_complaint_json: { Args: { payload: Json }; Returns: Json }
      upsert_company: { Args: { json_data: Json }; Returns: Json }
      upsert_company_data: {
        Args: { input_company_id: string; input_data: Json }
        Returns: Json
      }
      upsert_company_payment_method: {
        Args: { json_data: Json }
        Returns: Json
      }
      upsert_company_prompt: { Args: { json_data: Json }; Returns: Json }
      upsert_company_signature: { Args: { json_data: Json }; Returns: Json }
      upsert_company_type: { Args: { json_input: Json }; Returns: Json }
      upsert_company_user: { Args: { json_data: Json }; Returns: Json }
      upsert_invoice_payment_methods: { Args: { data: Json }; Returns: Json }
      upsert_membership_agent: { Args: { json_data: Json }; Returns: Json }
      upsert_membership_agent_company: {
        Args: { json_data: Json }
        Returns: Json
      }
      upsert_notification_template: { Args: { json_data: Json }; Returns: Json }
      upsert_process_file: { Args: { json_data: Json }; Returns: Json }
      upsert_process_type_files: {
        Args: { files_data: Json; process_type_id_param: string }
        Returns: Json
      }
      upsert_process_type_step: { Args: { json_data: Json }; Returns: Json }
      upsert_process_type_step_requirements: {
        Args: { process_type_step_id_param: string; requirements_data: Json }
        Returns: Json
      }
      upsert_process_type_step_resource: {
        Args: {
          p_process_type_id: string
          p_process_type_step_id: string
          p_resources_id: string
          p_state: boolean
        }
        Returns: string
      }
      upsert_process_user_id: { Args: { json_data: Json }; Returns: Json }
      upsert_product: { Args: { json_input: Json }; Returns: Json }
      upsert_qualified_lead_audit_log: {
        Args: { json_input: Json }
        Returns: Json
      }
      upsert_qualified_lead_json: { Args: { p_lead_data: Json }; Returns: Json }
      upsert_qualified_lead_note: { Args: { json_input: Json }; Returns: Json }
      upsert_reservation_settings: { Args: { json_input: Json }; Returns: Json }
      upsert_resource: {
        Args: {
          p_description: string
          p_document: string
          p_id: string
          p_image: string
          p_name: string
          p_state: boolean
          p_type: string
          p_url: string
        }
        Returns: string
      }
      upsert_service_feedback_campaign_json: {
        Args: { payload: Json }
        Returns: unknown
        SetofOptions: {
          from: "*"
          to: "service_feedback_campaigns"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      upsert_service_feedback_response_json: {
        Args: { payload: Json }
        Returns: Json
      }
      upsert_step_requirements: {
        Args: { requirements_data: Json; step_id_param: string }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
