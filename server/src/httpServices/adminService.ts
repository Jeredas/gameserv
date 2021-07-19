
import { databaseService } from '../databaseService';
import { Router } from './httpRouter';
import DefaultResponse from './defaultResponse';

async function clearStatistics() {
    try {
    const deleteResponse = await databaseService.db.collection('games').deleteMany({})
    return new DefaultResponse(true,deleteResponse);
    } catch(err) {
      return new DefaultResponse(false,err);
    }
    
  }

class AdminService {
  private router: Router;
  private serviceName: string = 'adminService';

  async start(router: Router) {
    this.router = router;
    this.addEndpoint('clearStatistics', clearStatistics);
    return true;
  }

  addEndpoint(name, func) {
    this.router.addRoute(this.serviceName + '/' + name, func);
  }
}

export const adminService = new AdminService();