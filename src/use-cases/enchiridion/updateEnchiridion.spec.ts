import { InMemoryEnchiridionRepository } from '@/repositories/in-memory/in-memory-enchiridion-repository'
import { expect, describe, it, beforeEach } from 'vitest'
import {UpdateEnchiridionUseCase} from '@/use-cases/enchiridion/updateEnchiridion'
import { EnchiridionNotExitsError } from '@/use-cases/errors/enchiridion-errors';




let enchiridionRepository: InMemoryEnchiridionRepository
let sut:UpdateEnchiridionUseCase

describe('Update Enchiridion Use Case', () => {
    beforeEach(() => {
        enchiridionRepository = new InMemoryEnchiridionRepository() //istanciar meu repositório
        sut = new UpdateEnchiridionUseCase( enchiridionRepository)


        enchiridionRepository.createEnchiridion({
            id: "26314c11974bd8a7cd2078b7",
            animal_id: "66314c11974bd8a7cd2078b7",
            teacher_id: "6616d924ee0af0e50602ca14",
            date:"30/04/2024",
            sequence:"2",
            weight: 35342.132,
            history: "Rex foi adotado em 2022.",
            reason_consult: "Consulta de rotina 2",
            deworming: "Não",
            date_deworming: "30/04/2024",
            temperature: "38.5",
            frequency_cardiac: "80",
            frequency_respiratory: "16",
            dehydration: "Não",
            lymph_node: "Não",
            type_mucous: "Normal",
            whats_mucous: "Normal",
            skin_annex: "Normal",
            system_circulatory: "Normal",
            system_respiratory: "Normal",
            system_digestive: "Normal",
            system_locomotor: "Normal",
            system_nervous: "Normal",
            system_genitourinary: "Normal",
            others: "",
            complementary_exams: "Não",
            diagnosis: "Não",
            trataments: "Não",
            observations: "Rex está em boas condições."
          })



    })

    it('should update Enchiridion', async () => {

        const { enchiridion} = await sut.execute({
            id: "26314c11974bd8a7cd2078b7",
            animal_id: "66314c11974bd8a7cd2078b7",
            teacher_id: "6616d924ee0af0e50602ca14",
            stringDate:"05/09/2024",
            weight: 164.13,
            history: "Cavalo de Troia",
            reason_consult: "Consulta de rotina 1",
            deworming: "Sim",
            date_deworming: "20/04/2024",
            temperature: "38.5",
            frequency_cardiac: "80",
            frequency_respiratory: "16",
            dehydration: "Sim",
            lymph_node: "Sim",
            type_mucous: "Alterado",
            whats_mucous: "Alterado",
            skin_annex: "Alterado",
            system_circulatory: "Alterado",
            system_respiratory: "Alterado",
            system_digestive: "Alterado",
            system_locomotor: "Alterado",
            system_nervous: "Alterado",
            system_genitourinary: "Alterado",
            others: "Alterado",
            complementary_exams: "Sim",
            diagnosis: "Sim",
            trataments: "Sim",
            observations: "Rex "
        })

        
        
        expect(enchiridion).toBeTypeOf('object');
        expect(enchiridion.id).toEqual("26314c11974bd8a7cd2078b7");
        expect(enchiridion.animal_id).toEqual("66314c11974bd8a7cd2078b7");
        expect(enchiridion.teacher_id).toEqual("6616d924ee0af0e50602ca14");
        expect(enchiridion.date).toBeInstanceOf(Date);
        expect(enchiridion.weight).toEqual(164.13);
        expect(enchiridion.history).toEqual("Cavalo de Troia");
        expect(enchiridion.reason_consult).toEqual("Consulta de rotina 1");
        expect(enchiridion.deworming).toEqual("Sim");
        expect(enchiridion.date_deworming).toEqual("20/04/2024");
        expect(enchiridion.temperature).toEqual("38.5");
        expect(enchiridion.frequency_cardiac).toEqual("80");
        expect(enchiridion.frequency_respiratory).toEqual("16");
        expect(enchiridion.dehydration).toEqual("Sim");
        expect(enchiridion.lymph_node).toEqual("Sim");
        expect(enchiridion.type_mucous).toEqual("Alterado");
        expect(enchiridion.whats_mucous).toEqual("Alterado");
        expect(enchiridion.skin_annex).toEqual("Alterado");
        expect(enchiridion.system_circulatory).toEqual("Alterado");
        expect(enchiridion.system_respiratory).toEqual("Alterado");
        expect(enchiridion.system_digestive).toEqual("Alterado");
        expect(enchiridion.system_locomotor).toEqual("Alterado");
        expect(enchiridion.system_nervous).toEqual("Alterado");
        expect(enchiridion.system_genitourinary).toEqual("Alterado");
        expect(enchiridion.others).toEqual("Alterado");
        expect(enchiridion.complementary_exams).toEqual("Sim");
        expect(enchiridion.diagnosis).toEqual("Sim");
        expect(enchiridion.trataments).toEqual("Sim");
        expect(enchiridion.observations).toEqual("Rex ");

    })


    it('Should error', async () => {


        await expect(sut.execute({
            id: "36314c11974bd8a7cd2078b7",
            animal_id: "66314c11974bd8a7cd2078b7",
            teacher_id: "6616d924ee0af0e50602ca14",
            stringDate:"05/06/2024",
            weight: 35342.132,
            history: "Cavalo de Troia",
            reason_consult: "Consulta de rotina 2",
            deworming: "Não",
            date_deworming: "30/06/2024",
            temperature: "38.5",
            frequency_cardiac: "80",
            frequency_respiratory: "16",
            dehydration: "Não",
            lymph_node: "Não",
            type_mucous: "Normal",
            whats_mucous: "Normal",
            skin_annex: "Normal",
            system_circulatory: "Normal",
            system_respiratory: "Normal",
            system_digestive: "Normal",
            system_locomotor: "Normal",
            system_nervous: "Normal",
            system_genitourinary: "Normal",
            others: "",
            complementary_exams: "Não",
            diagnosis: "Não",
            trataments: "Não",
            observations: "Rex está em boas condições."
        })).rejects.toBeInstanceOf( EnchiridionNotExitsError)

    })

})