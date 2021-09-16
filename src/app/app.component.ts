import { HttpClient } from '@angular/common/http';
import { Component,OnInit } from '@angular/core';





export interface dealerStruct{
  dealerId: number,
  name: string;
  vehicles:vehiclesData[],
}


export interface vehiclesData{
  vehicleId: number;
  year: number;
  make: string;
  model: string;

}


export interface vehiclesArray {
  vehicleIds:number[];

}

export interface   vehicleStruct {
  vehicleId: number;
  year: number;
  make: string;
  model: string;
  dealerId: number;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
    
  public vehiclesIds:number[];
  public dealerId:string[];

  public dealers:any[]=[];
  public dealerFinal:any[]=[];
  public dataSetId:string;
  public vehicleInfoData:vehicleStruct[]=[];
  public dealerIndex:number[]=[];
  public cheat:any;
  constructor(private http:HttpClient){

  }
  ngOnInit(){

     

  }

  clickStart(){
    let data=this.getDatasetId().subscribe(data => {
      this.dataSetId = data.datasetId;
      this.getDataCheat(this.dataSetId).subscribe( data =>{
          this.cheat=data;

      });

      this.getDatasetVehicle( this.dataSetId).subscribe(vehicles =>{
        this.vehiclesIds=vehicles.vehicleIds;
        let numberVehicle=this.vehiclesIds.length;
        let count=0;
        this.vehiclesIds.forEach(vehicle=>{

            this.getVehicleInfo(this.dataSetId,vehicle).subscribe( vehicleInfo =>{
                let dealerId:number=vehicleInfo.dealerId;
                let vehicleData:any={};
                this.vehicleInfoData.push(vehicleInfo);
                if(this.dealers[dealerId]==null){
                    this.getDealerInfo(this.dataSetId,dealerId).subscribe(dealerInfo =>{
                    
                    if(this.dealers[dealerId]==null) 
                    {
                      this.dealers[dealerId]=dealerInfo;
                      this.dealers[dealerId].vehicles=[]; 
                      this.dealerIndex.push(dealerId);
                    }
                    count++;   
                    vehicleData.vehicleId=vehicleInfo.vehicleId;
                    vehicleData.year=vehicleInfo.year;
                    vehicleData.make=vehicleInfo.make;  
                    vehicleData.model=vehicleInfo.model;
                    this.dealers[dealerId].vehicles.push(vehicleData);

                    if(count==numberVehicle){
                      this.rebuildJSON(this.dealers);                    
                        
                    }


                    });
                }
                else {
                    count++;
                    vehicleData.vehicleId=vehicleInfo.vehicleId;
                    vehicleData.year=vehicleInfo.year;
                    vehicleData.make=vehicleInfo.make;  
                    vehicleData.model=vehicleInfo.model;
                    this.dealers[dealerId].vehicle.push(vehicleData);
                    if(count==numberVehicle){
                     this.rebuildJSON(this.dealers);                    
                    }
                }    
              });
            })
  
      })


    });  

  }
  rebuildJSON(dealers:any[]){

    
    this.dealerIndex.forEach( index =>{
       this.dealerFinal.push(dealers[index]);;
    });


    
  }

  getDataCheat(dataSetId:string){
    return this.http.get<any>('https://api.coxauto-interview.com/api/'+dataSetId+'/cheat');
    
  }
  

  getDatasetId(){
    return this.http.get<any>('https://api.coxauto-interview.com/api/datasetId');
    
  }

  getDatasetVehicle(dataSetId:string){
    return this.http.get<vehiclesArray>('https://api.coxauto-interview.com/api/'+dataSetId+'/vehicles');
    
  }
  getVehicleInfo(dataSetId:string,vehicleId:number){
    return this.http.get< vehicleStruct >('https://api.coxauto-interview.com/api/'+dataSetId+'/vehicles/'+vehicleId);
  }

  getDealerInfo(dataSetId:string,dealerId:number){
    return this.http.get('https://api.coxauto-interview.com/api/'+dataSetId+'/dealers/'+dealerId);
  }

  




  title = 'CoxAutomotive';
}

