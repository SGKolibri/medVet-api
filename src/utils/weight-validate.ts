export class Validation {

    static isValidWeight(weight: number): boolean {
      if (weight <=0){
       return false
      }else{
        return true
      }
    };
}
